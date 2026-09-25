CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_number BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    rent_amount NUMERIC(12, 2) NOT NULL CHECK (rent_amount > 0),
    term_months SMALLINT NOT NULL CHECK (term_months BETWEEN 1 AND 36),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    template_version TEXT NOT NULL DEFAULT 'temporada-v1',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT contracts_date_range_valid CHECK (end_date > start_date),
    CONSTRAINT contracts_template_version_valid CHECK (
        CHAR_LENGTH(template_version) <= 80 AND CHAR_LENGTH(BTRIM(template_version)) > 0
    )
);

CREATE INDEX contracts_tenant_id_idx ON contracts (tenant_id, id);
