function toCount(value) {
  return Number(value || 0);
}

function toRow(row) {
  return Object.freeze({
    buildingId: row.building_id,
    buildingName: row.building_name,
    unitId: row.unit_id,
    unitIdentification: row.unit_identification,
    unitSubdivision: row.unit_subdivision,
    tenantId: row.tenant_id,
    tenantName: row.tenant_name,
    contractNumber: row.contract_number === null ? null : Number(row.contract_number),
  });
}

export function createReportRepository(pool) {
  return Object.freeze({
    async essential(buildingId = null) {
      const result = await pool.query(
        `WITH scoped_buildings AS (
           SELECT id, name
           FROM buildings
           WHERE active = TRUE AND ($1::UUID IS NULL OR id = $1)
         ), report_rows AS (
           SELECT b.id AS building_id, b.name AS building_name,
             u.id AS unit_id, u.identification AS unit_identification,
             u.subdivision AS unit_subdivision,
             t.id AS tenant_id, t.full_name AS tenant_name,
             c.contract_number
           FROM scoped_buildings b
           LEFT JOIN units u ON u.building_id = b.id
           LEFT JOIN tenants t ON t.unit_id = u.id
           LEFT JOIN contracts c ON c.tenant_id = t.id
         )
         SELECT
           (SELECT COUNT(*) FROM scoped_buildings) AS active_buildings,
           (SELECT COUNT(DISTINCT u.id) FROM units u JOIN scoped_buildings b ON b.id = u.building_id) AS units,
           (SELECT COUNT(*) FROM units u JOIN scoped_buildings b ON b.id = u.building_id
             WHERE NOT EXISTS (SELECT 1 FROM contracts c JOIN tenants t ON t.id = c.tenant_id WHERE t.unit_id = u.id AND CURRENT_DATE BETWEEN c.start_date AND c.end_date)
               AND NOT EXISTS (SELECT 1 FROM contracts c JOIN tenants t ON t.id = c.tenant_id WHERE t.unit_id = u.id AND c.start_date > CURRENT_DATE)) AS vacant_units,
           (SELECT COUNT(*) FROM units u JOIN scoped_buildings b ON b.id = u.building_id
             WHERE EXISTS (SELECT 1 FROM contracts c JOIN tenants t ON t.id = c.tenant_id WHERE t.unit_id = u.id AND CURRENT_DATE BETWEEN c.start_date AND c.end_date)) AS occupied_units,
           (SELECT COUNT(DISTINCT c.id) FROM contracts c JOIN tenants t ON t.id = c.tenant_id JOIN units u ON u.id = t.unit_id JOIN scoped_buildings b ON b.id = u.building_id WHERE c.start_date > CURRENT_DATE) AS scheduled_contracts,
           (SELECT COUNT(DISTINCT c.id) FROM contracts c JOIN tenants t ON t.id = c.tenant_id JOIN units u ON u.id = t.unit_id JOIN scoped_buildings b ON b.id = u.building_id WHERE CURRENT_DATE BETWEEN c.start_date AND c.end_date) AS active_contracts,
           (SELECT COUNT(DISTINCT t.id) FROM tenants t JOIN units u ON u.id = t.unit_id JOIN scoped_buildings b ON b.id = u.building_id WHERE t.active = TRUE) AS active_tenants,
           (SELECT COUNT(DISTINCT t.id) FROM tenants t JOIN units u ON u.id = t.unit_id JOIN scoped_buildings b ON b.id = u.building_id WHERE t.active = FALSE) AS archived_tenants,
           building_id, building_name, unit_id, unit_identification, unit_subdivision,
           tenant_id, tenant_name, contract_number
         FROM report_rows
         RIGHT JOIN (SELECT 1 AS ensure_result) marker ON TRUE
         ORDER BY building_name NULLS LAST, unit_subdivision NULLS FIRST,
           unit_identification NULLS FIRST, tenant_name NULLS FIRST, contract_number NULLS FIRST`,
        [buildingId],
      );

      const first = result.rows[0] || {};
      return Object.freeze({
        summary: Object.freeze({
          activeBuildings: toCount(first.active_buildings),
          units: toCount(first.units),
          vacantUnits: toCount(first.vacant_units),
          occupiedUnits: toCount(first.occupied_units),
          scheduledContracts: toCount(first.scheduled_contracts),
          activeContracts: toCount(first.active_contracts),
          activeTenants: toCount(first.active_tenants),
          archivedTenants: toCount(first.archived_tenants),
        }),
        rows: Object.freeze(result.rows.filter((row) => row.building_id).map(toRow)),
      });
    },
  });
}
