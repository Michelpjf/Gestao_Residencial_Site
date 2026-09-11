CREATE TABLE IF NOT EXISTS app_user_profiles (
    user_id UUID PRIMARY KEY,
    role TEXT NOT NULL CHECK (
        role IN ('admin', 'gerente', 'gestor', 'financeiro', 'manutencao')
    ),
    building_id UUID,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT gestor_requires_building CHECK (
        role <> 'gestor' OR building_id IS NOT NULL
    )
);

CREATE INDEX IF NOT EXISTS app_user_profiles_active_user_idx
    ON app_user_profiles (user_id)
    WHERE active = TRUE;
