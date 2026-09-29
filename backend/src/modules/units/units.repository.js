function toUnit(row) {
  return Object.freeze({
    id: row.id,
    buildingId: row.building_id,
    identification: row.identification,
    subdivision: row.subdivision,
    type: row.type,
    status: row.status,
    currentTenantId: row.current_tenant_id ?? null,
    currentTenantName: row.current_tenant_name ?? null,
    currentContractId: row.current_contract_id ?? null,
    currentContractNumber: row.current_contract_number === undefined || row.current_contract_number === null
      ? null
      : Number(row.current_contract_number),
    currentContractStartDate: row.current_contract_start_date ?? null,
    currentContractEndDate: row.current_contract_end_date ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

const columns = `u.id, u.building_id, u.identification, u.subdivision, u.type,
  CASE WHEN occupancy.contract_id IS NULL THEN 'vago' ELSE 'ocupado' END AS status,
  occupancy.tenant_id AS current_tenant_id, occupancy.full_name AS current_tenant_name,
  occupancy.contract_id AS current_contract_id, occupancy.contract_number AS current_contract_number,
  occupancy.start_date AS current_contract_start_date, occupancy.end_date AS current_contract_end_date,
  u.created_at, u.updated_at`;
const occupancyJoin = `LEFT JOIN LATERAL (
  SELECT c.id AS contract_id, c.contract_number, c.start_date, c.end_date, t.id AS tenant_id, t.full_name
  FROM tenants t
  JOIN contracts c ON c.tenant_id = t.id
  WHERE t.unit_id = u.id AND CURRENT_DATE BETWEEN c.start_date AND c.end_date
  ORDER BY c.start_date DESC, c.contract_number DESC
  LIMIT 1
) occupancy ON TRUE`;

export function createUnitRepository(pool) {
  return Object.freeze({
    async listActive(buildingId) {
      const result = await pool.query(
        `SELECT ${columns} FROM units u
         JOIN buildings b ON b.id = u.building_id AND b.active = TRUE
         ${occupancyJoin}
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
         ${occupancyJoin}
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
