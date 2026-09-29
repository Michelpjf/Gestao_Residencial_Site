export function createUserProfileRepository(pool) {
  return Object.freeze({
    async findActiveByIdentity({ provider, subject }) {
      const result = await pool.query(
        `SELECT p.user_id, p.role, p.building_id, p.display_name, b.name AS building_name
           FROM app_user_profiles p
           LEFT JOIN buildings b ON b.id = p.building_id
          WHERE p.identity_provider = $1
            AND p.auth_subject = $2
            AND p.active = TRUE
          LIMIT 1`,
        [provider, subject],
      );

      const profile = result.rows[0];
      if (!profile) return null;

      return Object.freeze({
        userId: profile.user_id,
        role: profile.role,
        buildingId: profile.building_id,
        displayName: profile.display_name,
        buildingName: profile.building_name,
      });
    },
  });
}
