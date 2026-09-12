export function createUserProfileRepository(pool) {
  return Object.freeze({
    async findActiveByIdentity({ provider, subject }) {
      const result = await pool.query(
        `SELECT user_id, role, building_id
           FROM app_user_profiles
          WHERE identity_provider = $1
            AND auth_subject = $2
            AND active = TRUE
          LIMIT 1`,
        [provider, subject],
      );

      const profile = result.rows[0];
      if (!profile) return null;

      return Object.freeze({
        userId: profile.user_id,
        role: profile.role,
        buildingId: profile.building_id,
      });
    },
  });
}
