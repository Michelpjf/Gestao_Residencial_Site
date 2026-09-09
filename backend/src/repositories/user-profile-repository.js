export function createUserProfileRepository(pool) {
  return Object.freeze({
    async findActiveByUserId(userId) {
      const result = await pool.query(
        `SELECT user_id, role, building_id
           FROM app_user_profiles
          WHERE user_id = $1
            AND active = TRUE
          LIMIT 1`,
        [userId],
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
