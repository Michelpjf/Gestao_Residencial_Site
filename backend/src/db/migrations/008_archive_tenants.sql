ALTER TABLE tenants
    ADD COLUMN active BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN archived_at TIMESTAMPTZ;

ALTER TABLE tenants
    ADD CONSTRAINT tenants_archive_state_valid CHECK (
        (active = TRUE AND archived_at IS NULL)
        OR (active = FALSE AND archived_at IS NOT NULL)
    );

CREATE INDEX tenants_active_unit_id_idx ON tenants (unit_id, id) WHERE active = TRUE;
