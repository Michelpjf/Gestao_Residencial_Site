ALTER TABLE app_user_profiles
    RENAME COLUMN user_id TO auth_subject;

ALTER TABLE app_user_profiles
    ALTER COLUMN auth_subject TYPE TEXT USING auth_subject::TEXT;

ALTER TABLE app_user_profiles
    ADD COLUMN user_id UUID NOT NULL DEFAULT gen_random_uuid(),
    ADD COLUMN identity_provider TEXT NOT NULL DEFAULT 'supabase';

ALTER TABLE app_user_profiles
    DROP CONSTRAINT app_user_profiles_pkey,
    ADD CONSTRAINT app_user_profiles_pkey PRIMARY KEY (user_id),
    ADD CONSTRAINT app_user_profiles_identity_unique
        UNIQUE (identity_provider, auth_subject),
    ADD CONSTRAINT app_user_profiles_identity_provider_not_blank
        CHECK (BTRIM(identity_provider) <> ''),
    ADD CONSTRAINT app_user_profiles_auth_subject_not_blank
        CHECK (BTRIM(auth_subject) <> ''),
    ADD CONSTRAINT app_user_profiles_internal_id_is_distinct
        CHECK (user_id::TEXT <> auth_subject);

DROP INDEX app_user_profiles_active_user_idx;

CREATE INDEX app_user_profiles_active_identity_idx
    ON app_user_profiles (identity_provider, auth_subject)
    WHERE active = TRUE;
