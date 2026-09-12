function toBuilding(row) {
  return Object.freeze({
    id: row.id,
    name: row.name,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

const returningColumns = 'id, name, active, created_at, updated_at';

export function createBuildingRepository(pool) {
  return Object.freeze({
    async listActive({ buildingId = null } = {}) {
      const result = await pool.query(
        `SELECT ${returningColumns}
           FROM buildings
          WHERE active = TRUE
            AND ($1::UUID IS NULL OR id = $1)
          ORDER BY LOWER(name), id`,
        [buildingId],
      );
      return result.rows.map(toBuilding);
    },

    async create({ name }) {
      const result = await pool.query(
        `INSERT INTO buildings (name)
         VALUES ($1)
         RETURNING ${returningColumns}`,
        [name],
      );
      return toBuilding(result.rows[0]);
    },

    async updateName({ id, name }) {
      const result = await pool.query(
        `UPDATE buildings
            SET name = $2,
                updated_at = NOW()
          WHERE id = $1
            AND active = TRUE
         RETURNING ${returningColumns}`,
        [id, name],
      );
      return result.rows[0] ? toBuilding(result.rows[0]) : null;
    },

    async deactivate(id) {
      const result = await pool.query(
        `UPDATE buildings
            SET active = FALSE,
                updated_at = NOW()
          WHERE id = $1
            AND active = TRUE
         RETURNING ${returningColumns}`,
        [id],
      );
      return result.rows[0] ? toBuilding(result.rows[0]) : null;
    },
  });
}
