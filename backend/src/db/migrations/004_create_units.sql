CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE RESTRICT,
    identification TEXT NOT NULL,
    subdivision TEXT,
    type TEXT NOT NULL CHECK (type IN ('quarto', 'loft')),
    status TEXT NOT NULL DEFAULT 'vago' CHECK (status = 'vago'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT units_identification_valid CHECK (
        CHAR_LENGTH(identification) <= 80 AND CHAR_LENGTH(BTRIM(identification)) > 0
    ),
    CONSTRAINT units_subdivision_valid CHECK (
        subdivision IS NULL OR (
            CHAR_LENGTH(subdivision) <= 80 AND CHAR_LENGTH(BTRIM(subdivision)) > 0
        )
    )
);

CREATE UNIQUE INDEX units_building_subdivision_identification_unique_idx
    ON units (
        building_id,
        LOWER(BTRIM(COALESCE(subdivision, ''))),
        LOWER(BTRIM(identification))
    );

CREATE INDEX units_building_id_idx ON units (building_id, id);
