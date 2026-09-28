function toAssignment(row) {
  return Object.freeze({
    userId: row.user_id,
    displayName: row.display_name,
    building: Object.freeze({ id: row.building_id, name: row.building_name }),
    updatedAt: row.updated_at,
  });
}

const assignmentColumns = `p.user_id, p.display_name, p.building_id,
  b.name AS building_name, p.updated_at`;

export function createAdminAccessRepository(pool) {
  return Object.freeze({
    async listActiveManagers() {
      const result = await pool.query(
        `SELECT ${assignmentColumns}
           FROM app_user_profiles p
           JOIN buildings b ON b.id = p.building_id
          WHERE p.role = 'gestor'
            AND p.active = TRUE
            AND b.active = TRUE
          ORDER BY COALESCE(LOWER(p.display_name), p.user_id::TEXT), p.user_id`,
      );
      return result.rows.map(toAssignment);
    },

    async assignManager({ actorUserId, managerUserId, displayName, buildingId }) {
      const result = await pool.query(
        `WITH target AS (
           SELECT user_id, building_id AS previous_building_id
             FROM app_user_profiles
            WHERE user_id = $2
              AND role = 'gestor'
              AND active = TRUE
         ), updated AS (
           UPDATE app_user_profiles p
              SET display_name = $3,
                  building_id = $4,
                  updated_at = NOW()
             FROM target t
            WHERE p.user_id = t.user_id
              AND EXISTS (
                SELECT 1 FROM buildings b
                 WHERE b.id = $4
                   AND b.active = TRUE
              )
         RETURNING p.user_id, p.display_name, p.building_id, p.updated_at,
                   t.previous_building_id
         ), audit AS (
           INSERT INTO manager_assignment_audit (
             actor_user_id, manager_user_id, previous_building_id, new_building_id
           )
           SELECT $1, user_id, previous_building_id, building_id
             FROM updated
         RETURNING id
         )
         SELECT u.user_id, u.display_name, u.building_id,
                b.name AS building_name, u.updated_at
           FROM updated u
           JOIN buildings b ON b.id = u.building_id
           CROSS JOIN audit`,
        [actorUserId, managerUserId, displayName, buildingId],
      );
      return result.rows[0] ? toAssignment(result.rows[0]) : null;
    },
  });
}
