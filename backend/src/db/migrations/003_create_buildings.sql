CREATE TABLE buildings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT buildings_name_valid CHECK (
        name = BTRIM(name)
        AND CHAR_LENGTH(name) BETWEEN 2 AND 160
    )
);

CREATE UNIQUE INDEX buildings_name_unique_idx
    ON buildings (LOWER(name));

CREATE INDEX buildings_active_name_idx
    ON buildings (LOWER(name), id)
    WHERE active = TRUE;
