ALTER TABLE app_user_profiles
    ADD COLUMN display_name TEXT;

ALTER TABLE app_user_profiles
    ADD CONSTRAINT app_user_profiles_display_name_valid CHECK (
        display_name IS NULL OR (
            display_name = BTRIM(display_name)
            AND CHAR_LENGTH(display_name) BETWEEN 2 AND 160
        )
    ),
    ADD CONSTRAINT app_user_profiles_building_fkey
        FOREIGN KEY (building_id) REFERENCES buildings (id) ON DELETE RESTRICT;

CREATE TABLE manager_assignment_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID NOT NULL REFERENCES app_user_profiles (user_id) ON DELETE RESTRICT,
    manager_user_id UUID NOT NULL REFERENCES app_user_profiles (user_id) ON DELETE RESTRICT,
    previous_building_id UUID REFERENCES buildings (id) ON DELETE RESTRICT,
    new_building_id UUID NOT NULL REFERENCES buildings (id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX manager_assignment_audit_manager_created_idx
    ON manager_assignment_audit (manager_user_id, created_at DESC);
