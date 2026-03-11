-- Migration: 002_personal_data_permissions
-- Description: Table to track app permissions for personal data access

CREATE TABLE IF NOT EXISTS personal_data_permissions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_name    VARCHAR(255) NOT NULL,
    permission_type VARCHAR(100) NOT NULL, -- e.g., 'CONTACTS', 'LOCATION', 'SMS', 'CAMERA', 'MICROPHONE'
    status          VARCHAR(20) NOT NULL DEFAULT 'denied' CHECK (status IN ('granted', 'denied', 'prompt')),
    granted_at      TIMESTAMPTZ,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraint: Each app can have only one record per permission type
    CONSTRAINT unique_app_permission UNIQUE (package_name, permission_type)
);

CREATE INDEX idx_permissions_package_name ON personal_data_permissions(package_name);

-- Trigger for updated_at
CREATE TRIGGER trigger_personal_data_permissions_updated_at
    BEFORE UPDATE ON personal_data_permissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
