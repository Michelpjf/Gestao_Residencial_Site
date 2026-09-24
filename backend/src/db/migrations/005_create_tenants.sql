CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE RESTRICT,
    full_name TEXT NOT NULL,
    cpf CHAR(11) NOT NULL,
    rg TEXT NOT NULL,
    birth_date DATE NOT NULL,
    marital_status TEXT NOT NULL,
    address_goiania TEXT NOT NULL,
    address_origin TEXT NOT NULL,
    phone TEXT NOT NULL,
    reference_one_name TEXT NOT NULL,
    reference_one_phone TEXT NOT NULL,
    reference_two_name TEXT NOT NULL,
    reference_two_phone TEXT NOT NULL,
    occupation_institution TEXT,
    commercial_phone TEXT,
    commercial_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT tenants_cpf_digits CHECK (cpf ~ '^[0-9]{11}$'),
    CONSTRAINT tenants_full_name_valid CHECK (CHAR_LENGTH(full_name) <= 160 AND CHAR_LENGTH(BTRIM(full_name)) > 0),
    CONSTRAINT tenants_rg_valid CHECK (CHAR_LENGTH(rg) <= 30 AND CHAR_LENGTH(BTRIM(rg)) > 0),
    CONSTRAINT tenants_marital_status_valid CHECK (CHAR_LENGTH(marital_status) <= 40 AND CHAR_LENGTH(BTRIM(marital_status)) > 0),
    CONSTRAINT tenants_addresses_valid CHECK (
        CHAR_LENGTH(address_goiania) <= 300 AND CHAR_LENGTH(BTRIM(address_goiania)) > 0
        AND CHAR_LENGTH(address_origin) <= 300 AND CHAR_LENGTH(BTRIM(address_origin)) > 0
    ),
    CONSTRAINT tenants_contact_valid CHECK (
        CHAR_LENGTH(phone) <= 30 AND CHAR_LENGTH(BTRIM(phone)) > 0
        AND CHAR_LENGTH(reference_one_name) <= 160 AND CHAR_LENGTH(BTRIM(reference_one_name)) > 0
        AND CHAR_LENGTH(reference_one_phone) <= 30 AND CHAR_LENGTH(BTRIM(reference_one_phone)) > 0
        AND CHAR_LENGTH(reference_two_name) <= 160 AND CHAR_LENGTH(BTRIM(reference_two_name)) > 0
        AND CHAR_LENGTH(reference_two_phone) <= 30 AND CHAR_LENGTH(BTRIM(reference_two_phone)) > 0
    ),
    CONSTRAINT tenants_optional_fields_valid CHECK (
        (occupation_institution IS NULL OR (CHAR_LENGTH(occupation_institution) <= 160 AND CHAR_LENGTH(BTRIM(occupation_institution)) > 0))
        AND (commercial_phone IS NULL OR (CHAR_LENGTH(commercial_phone) <= 30 AND CHAR_LENGTH(BTRIM(commercial_phone)) > 0))
        AND (commercial_address IS NULL OR (CHAR_LENGTH(commercial_address) <= 300 AND CHAR_LENGTH(BTRIM(commercial_address)) > 0))
    )
);

CREATE UNIQUE INDEX tenants_cpf_unique_idx ON tenants (cpf);
CREATE INDEX tenants_unit_id_idx ON tenants (unit_id, id);
