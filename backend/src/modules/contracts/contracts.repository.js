function base(row) {
  return {
    id: row.id,
    contractNumber: Number(row.contract_number),
    tenantId: row.tenant_id,
    tenantName: row.full_name,
    unitId: row.unit_id,
    buildingId: row.building_id,
    buildingName: row.building_name,
    unitIdentification: row.unit_identification,
    unitSubdivision: row.unit_subdivision,
    unitType: row.unit_type,
    rentAmount: row.rent_amount,
    termMonths: row.term_months,
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status,
    templateVersion: row.template_version,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toSummary(row) {
  return Object.freeze(base(row));
}

function toContract(row) {
  return Object.freeze({
    ...base(row),
    tenantCpf: row.cpf,
    tenantRg: row.rg,
    tenantBirthDate: row.birth_date,
    tenantMaritalStatus: row.marital_status,
    tenantAddressGoiania: row.address_goiania,
    tenantAddressOrigin: row.address_origin,
    tenantPhone: row.phone,
    referenceOneName: row.reference_one_name,
    referenceOnePhone: row.reference_one_phone,
    referenceTwoName: row.reference_two_name,
    referenceTwoPhone: row.reference_two_phone,
    occupationInstitution: row.occupation_institution,
    commercialPhone: row.commercial_phone,
    commercialAddress: row.commercial_address,
  });
}

const summaryColumns = `c.id, c.contract_number, c.tenant_id, c.rent_amount, c.term_months,
  c.start_date, c.end_date,
  CASE WHEN CURRENT_DATE < c.start_date THEN 'agendado'
       WHEN CURRENT_DATE <= c.end_date THEN 'vigente'
       ELSE 'encerrado' END AS status,
  c.template_version, c.created_at, c.updated_at,
  t.full_name, u.id AS unit_id, u.building_id, u.identification AS unit_identification,
  u.subdivision AS unit_subdivision, u.type AS unit_type, b.name AS building_name`;
const detailColumns = `${summaryColumns}, t.cpf, t.rg, t.birth_date, t.marital_status,
  t.address_goiania, t.address_origin, t.phone,
  t.reference_one_name, t.reference_one_phone, t.reference_two_name, t.reference_two_phone,
  t.occupation_institution, t.commercial_phone, t.commercial_address`;
const joins = `JOIN tenants t ON t.id = c.tenant_id
  JOIN units u ON u.id = t.unit_id
  JOIN buildings b ON b.id = u.building_id AND b.active = TRUE`;

export function createContractRepository(pool) {
  return Object.freeze({
    async findTenantUnit(tenantId, buildingId = null) {
      const result = await pool.query(
        `SELECT t.unit_id FROM tenants t
         JOIN units u ON u.id = t.unit_id
         JOIN buildings b ON b.id = u.building_id AND b.active = TRUE
         WHERE t.id = $1 AND t.active = TRUE AND ($2::UUID IS NULL OR u.building_id = $2)`,
        [tenantId, buildingId],
      );
      return result.rows[0]?.unit_id ?? null;
    },

    async hasPeriodConflict(unitId, startDate, endDate) {
      const result = await pool.query(
        `SELECT EXISTS (
           SELECT 1 FROM contracts c
           JOIN tenants t ON t.id = c.tenant_id
           WHERE t.unit_id = $1 AND c.start_date <= $3 AND c.end_date >= $2
         ) AS conflict`,
        [unitId, startDate, endDate],
      );
      return Boolean(result.rows[0]?.conflict);
    },
    async listActive(buildingId = null) {
      const result = await pool.query(
        `SELECT ${summaryColumns} FROM contracts c ${joins}
         WHERE ($1::UUID IS NULL OR u.building_id = $1)
         ORDER BY c.contract_number DESC`,
        [buildingId],
      );
      return result.rows.map(toSummary);
    },

    async findActive(contractId, buildingId = null) {
      const result = await pool.query(
        `SELECT ${detailColumns} FROM contracts c ${joins}
         WHERE c.id = $1 AND ($2::UUID IS NULL OR u.building_id = $2)`,
        [contractId, buildingId],
      );
      return result.rows[0] ? toContract(result.rows[0]) : null;
    },

    async create(input, buildingId = null) {
      const result = await pool.query(
        `WITH selected_tenant AS (
           SELECT t.id, t.unit_id FROM tenants t
           JOIN units u ON u.id = t.unit_id
           JOIN buildings b ON b.id = u.building_id AND b.active = TRUE
           WHERE t.id = $1 AND t.active = TRUE AND ($7::UUID IS NULL OR u.building_id = $7)
           FOR UPDATE OF u
         ), inserted AS (
           INSERT INTO contracts (tenant_id, rent_amount, term_months, start_date, end_date, template_version)
           SELECT st.id, $2, $3, $4, $5, $6 FROM selected_tenant st
           WHERE NOT EXISTS (
             SELECT 1 FROM contracts c
             JOIN tenants existing_tenant ON existing_tenant.id = c.tenant_id
             WHERE existing_tenant.unit_id = st.unit_id
               AND c.start_date <= $5 AND c.end_date >= $4
           )
           RETURNING *
         )
         SELECT ${detailColumns} FROM inserted c ${joins}`,
        [input.tenantId, input.rentAmount, input.termMonths, input.startDate, input.endDate, input.templateVersion, buildingId],
      );
      return result.rows[0] ? toContract(result.rows[0]) : null;
    },
  });
}
