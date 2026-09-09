import { createRemoteJWKSet, decodeProtectedHeader, jwtVerify } from 'jose';

const ALLOWED_JWT_ALGORITHMS = Object.freeze(['ES256', 'RS256']);

async function verifyLegacyToken({ token, supabaseUrl, publishableKey, audience, fetchImpl }) {
  const response = await fetchImpl(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: publishableKey,
      authorization: `Bearer ${token}`,
    },
    signal: AbortSignal.timeout(5_000),
  });

  if (!response.ok) {
    throw new Error('Supabase Auth rejected the token');
  }

  const user = await response.json();
  if (typeof user.id !== 'string' || (user.aud && user.aud !== audience)) {
    throw new Error('Supabase Auth returned an invalid user context');
  }

  return { sub: user.id };
}

export function createSupabaseTokenVerifier({
  supabaseUrl,
  publishableKey,
  audience,
  jwks,
  fetchImpl = fetch,
}) {
  const issuer = `${supabaseUrl.replace(/\/$/, '')}/auth/v1`;
  const keySet = jwks ?? createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`));

  return async function verifySupabaseToken(token) {
    const { alg } = decodeProtectedHeader(token);

    if (alg === 'HS256') {
      return verifyLegacyToken({
        token,
        supabaseUrl: supabaseUrl.replace(/\/$/, ''),
        publishableKey,
        audience,
        fetchImpl,
      });
    }

    if (!ALLOWED_JWT_ALGORITHMS.includes(alg)) {
      throw new Error('Unsupported JWT algorithm');
    }

    const { payload } = await jwtVerify(token, keySet, {
      issuer,
      audience,
      algorithms: ALLOWED_JWT_ALGORITHMS,
      requiredClaims: ['sub', 'iat', 'exp'],
      clockTolerance: 5,
    });

    return payload;
  };
}
