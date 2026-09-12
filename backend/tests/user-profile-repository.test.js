import { describe, expect, it, vi } from 'vitest';
import { createUserProfileRepository } from '../src/repositories/user-profile-repository.js';

const AUTH_SUBJECT = '79b54647-32b5-4fe8-ab2d-b89d808d57b4';
const USER_ID = '3f185149-f16e-47a8-8ac3-2c29190f2b50';

describe('user profile repository', () => {
  it('resolves an internal user from an external identity', async () => {
    const query = vi.fn().mockResolvedValue({
      rows: [
        {
          user_id: USER_ID,
          role: 'gestor',
          building_id: '0f99b81d-9cf1-4cfa-9331-e397fb02044d',
        },
      ],
    });
    const repository = createUserProfileRepository({ query });

    const profile = await repository.findActiveByIdentity({
      provider: 'supabase',
      subject: AUTH_SUBJECT,
    });

    expect(profile).toEqual({
      userId: USER_ID,
      role: 'gestor',
      buildingId: '0f99b81d-9cf1-4cfa-9331-e397fb02044d',
    });
    expect(query).toHaveBeenCalledWith(expect.stringContaining('identity_provider = $1'), [
      'supabase',
      AUTH_SUBJECT,
    ]);
  });

  it('returns null when the external identity has no active profile', async () => {
    const repository = createUserProfileRepository({
      query: vi.fn().mockResolvedValue({ rows: [] }),
    });

    await expect(
      repository.findActiveByIdentity({ provider: 'supabase', subject: AUTH_SUBJECT }),
    ).resolves.toBeNull();
  });
});
