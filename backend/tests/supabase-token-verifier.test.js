import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT } from 'jose';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { createSupabaseTokenVerifier } from '../src/security/supabase-token-verifier.js';

const SUPABASE_URL = 'https://example.supabase.co';
const ISSUER = `${SUPABASE_URL}/auth/v1`;
const AUDIENCE = 'authenticated';
const USER_ID = '79b54647-32b5-4fe8-ab2d-b89d808d57b4';
const PUBLISHABLE_KEY = 'sb_publishable_example';

let privateKey;
let verifier;

beforeAll(async () => {
  const keyPair = await generateKeyPair('ES256');
  privateKey = keyPair.privateKey;
  const publicJwk = await exportJWK(keyPair.publicKey);
  publicJwk.kid = 'test-key';
  publicJwk.alg = 'ES256';
  publicJwk.use = 'sig';

  verifier = createSupabaseTokenVerifier({
    supabaseUrl: SUPABASE_URL,
    publishableKey: PUBLISHABLE_KEY,
    audience: AUDIENCE,
    jwks: createLocalJWKSet({ keys: [publicJwk] }),
  });
});

async function signToken(overrides = {}) {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ sub: USER_ID, ...overrides.payload })
    .setProtectedHeader({ alg: 'ES256', kid: 'test-key' })
    .setIssuer(overrides.issuer ?? ISSUER)
    .setAudience(overrides.audience ?? AUDIENCE)
    .setIssuedAt(now)
    .setExpirationTime(overrides.expiration ?? now + 300)
    .sign(privateKey);
}

describe('Supabase token verifier', () => {
  it('accepts a signed token with expected issuer and audience', async () => {
    const payload = await verifier(await signToken());
    expect(payload.sub).toBe(USER_ID);
  });

  it('rejects a token issued for another audience', async () => {
    await expect(verifier(await signToken({ audience: 'other' }))).rejects.toThrow();
  });

  it('rejects an expired token', async () => {
    const now = Math.floor(Date.now() / 1000);
    await expect(verifier(await signToken({ expiration: now - 60 }))).rejects.toThrow();
  });

  it('validates legacy HS256 tokens through the Supabase Auth server', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ id: USER_ID, aud: AUDIENCE }),
    });
    const legacyVerifier = createSupabaseTokenVerifier({
      supabaseUrl: SUPABASE_URL,
      publishableKey: PUBLISHABLE_KEY,
      audience: AUDIENCE,
      jwks: vi.fn(),
      fetchImpl,
    });
    const token = await new SignJWT({ sub: USER_ID })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(new TextEncoder().encode('test-secret-with-sufficient-length'));

    await expect(legacyVerifier(token)).resolves.toEqual({ sub: USER_ID });
    expect(fetchImpl).toHaveBeenCalledWith(
      `${SUPABASE_URL}/auth/v1/user`,
      expect.objectContaining({
        headers: {
          apikey: PUBLISHABLE_KEY,
          authorization: `Bearer ${token}`,
        },
      }),
    );
  });

  it('rejects a legacy token when Supabase Auth rejects it', async () => {
    const legacyVerifier = createSupabaseTokenVerifier({
      supabaseUrl: SUPABASE_URL,
      publishableKey: PUBLISHABLE_KEY,
      audience: AUDIENCE,
      jwks: vi.fn(),
      fetchImpl: vi.fn().mockResolvedValue({ ok: false }),
    });
    const token = await new SignJWT({ sub: USER_ID })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(new TextEncoder().encode('test-secret-with-sufficient-length'));

    await expect(legacyVerifier(token)).rejects.toThrow();
  });
});
