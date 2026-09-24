function toUnit(row) {
  return Object.freeze({
    id: row.id,
    buildingId: row.building_id,
    identification: row.identification,
    subdivision: row.subdivision,
    type: row.type,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

const columns = 'u.id, u.building_id, u.identification, u.subdivision, u.type, u.status, u.created_at, u.updated_at';

export function createUnitRepository(pool) {
  return Object.freeze({
    async listActive(buildingId) {
      const result = await pool.query(
        `SELECT ${columns} FROM units u
         JOIN buildings b ON b.id = u.building_id AND b.active = TRUE
         WHERE u.building_id = $1
         ORDER BY LOWER(BTRIM(COALESCE(u.subdivision, ''))), LOWER(BTRIM(u.identification)), u.id`,
        [buildingId],
      );
      return result.rows.map(toUnit);
    },

    async findActive(unitId, buildingId = null) {
      const result = await pool.query(
        `SELECT ${columns} FROM units u
         JOIN buildings b ON b.id = u.building_id AND b.active = TRUE
         WHERE u.id = $1 AND ($2::UUID IS NULL OR u.building_id = $2)`,
        [unitId, buildingId],
      );
      return result.rows[0] ? toUnit(result.rows[0]) : null;
    },

    async create({ buildingId, identification, subdivision, type }) {
      // FOR SHARE serializes this active check with a concurrent building inactivation.
      const result = await pool.query(
        `INSERT INTO units (building_id, identification, subdivision, type)
         SELECT b.id, $2, $3, $4 FROM buildings b
         WHERE b.id = $1 AND b.active = TRUE FOR SHARE
         RETURNING id, building_id, identification, subdivision, type, status, created_at, updated_at`,
        [buildingId, identification, subdivision, type],
      );
      return result.rows[0] ? toUnit(result.rows[0]) : null;
    },
  });
}
