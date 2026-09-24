function toTenant(row) {
  return Object.freeze({
    id: row.id,
    unitId: row.unit_id,
    buildingId: row.building_id,
    buildingName: row.building_name,
    unitIdentification: row.unit_identification,
    unitSubdivision: row.unit_subdivision,
    fullName: row.full_name,
    cpf: row.cpf,
    rg: row.rg,
    birthDate: row.birth_date,
    maritalStatus: row.marital_status,
    addressGoiania: row.address_goiania,
    addressOrigin: row.address_origin,
    phone: row.phone,
    referenceOneName: row.reference_one_name,
    referenceOnePhone: row.reference_one_phone,
    referenceTwoName: row.reference_two_name,
    referenceTwoPhone: row.reference_two_phone,
    occupationInstitution: row.occupation_institution,
    commercialPhone: row.commercial_phone,
    commercialAddress: row.commercial_address,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

function toTenantSummary(row) {
  return Object.freeze({
    id: row.id,
    unitId: row.unit_id,
    buildingId: row.building_id,
    buildingName: row.building_name,
    unitIdentification: row.unit_identification,
    unitSubdivision: row.unit_subdivision,
    fullName: row.full_name,
  });
}

const columns = `t.id, t.unit_id, u.building_id, b.name AS building_name,
  u.identification AS unit_identification, u.subdivision AS unit_subdivision,
  t.full_name, t.cpf, t.rg, t.birth_date, t.marital_status,
  t.address_goiania, t.address_origin, t.phone,
  t.reference_one_name, t.reference_one_phone, t.reference_two_name, t.reference_two_phone,
  t.occupation_institution, t.commercial_phone, t.commercial_address,
  t.created_at, t.updated_at`;
const summaryColumns = `t.id, t.unit_id, u.building_id, b.name AS building_name,
  u.identification AS unit_identification, u.subdivision AS unit_subdivision, t.full_name`;

export function createTenantRepository(pool) {
  return Object.freeze({
    async listActive(buildingId = null) {
      const result = await pool.query(
        `SELECT ${summaryColumns}
           FROM tenants t
           JOIN units u ON u.id = t.unit_id
           JOIN buildings b ON b.id = u.building_id AND b.active = TRUE
          WHERE ($1::UUID IS NULL OR u.building_id = $1)
          ORDER BY LOWER(BTRIM(t.full_name)), t.id`,
        [buildingId],
      );
      return result.rows.map(toTenantSummary);
    },

    async findActive(tenantId, buildingId = null) {
      const result = await pool.query(
        `SELECT ${columns}
           FROM tenants t
           JOIN units u ON u.id = t.unit_id
           JOIN buildings b ON b.id = u.building_id AND b.active = TRUE
          WHERE t.id = $1 AND ($2::UUID IS NULL OR u.building_id = $2)`,
        [tenantId, buildingId],
      );
      return result.rows[0] ? toTenant(result.rows[0]) : null;
    },

    async create(input, buildingId = null) {
      const values = [
        input.unitId, input.fullName, input.cpf, input.rg, input.birthDate, input.maritalStatus,
        input.addressGoiania, input.addressOrigin, input.phone,
        input.referenceOneName, input.referenceOnePhone, input.referenceTwoName, input.referenceTwoPhone,
        input.occupationInstitution, input.commercialPhone, input.commercialAddress, buildingId,
      ];
      const result = await pool.query(
        `WITH selected_unit AS (
           SELECT u.id FROM units u
           JOIN buildings b ON b.id = u.building_id AND b.active = TRUE
           WHERE u.id = $1 AND ($17::UUID IS NULL OR u.building_id = $17)
           FOR SHARE
         ), inserted AS (
           INSERT INTO tenants (
             unit_id, full_name, cpf, rg, birth_date, marital_status,
             address_goiania, address_origin, phone,
             reference_one_name, reference_one_phone, reference_two_name, reference_two_phone,
             occupation_institution, commercial_phone, commercial_address
           )
           SELECT id, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
           FROM selected_unit
           RETURNING *
         )
         SELECT ${columns}
           FROM inserted t
           JOIN units u ON u.id = t.unit_id
           JOIN buildings b ON b.id = u.building_id`,
        values,
      );
      return result.rows[0] ? toTenant(result.rows[0]) : null;
    },
  });
}
