-- PrivacyLens Database Migration
-- Version: 001 - Initial Schema

-- ─── Extensions ─────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Devices Table ──────────────────────────────────
CREATE TABLE IF NOT EXISTS devices (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id       VARCHAR(255) NOT NULL UNIQUE,
    android_version VARCHAR(20),
    app_version     VARCHAR(20),
    device_model    VARCHAR(100),
    refresh_token   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_devices_device_id ON devices(device_id);

-- ─── Domains Intelligence Table ─────────────────────
CREATE TABLE IF NOT EXISTS domains (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain      VARCHAR(512) NOT NULL UNIQUE,
    risk_score  INTEGER NOT NULL DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    categories  TEXT[] DEFAULT '{}',
    sources     TEXT[] DEFAULT '{}',
    confidence  NUMERIC(4,3) DEFAULT 0.0 CHECK (confidence >= 0 AND confidence <= 1),
    is_blocked  BOOLEAN DEFAULT false,
    first_seen  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_domains_domain ON domains(domain);
CREATE INDEX idx_domains_risk_score ON domains(risk_score);
CREATE INDEX idx_domains_is_blocked ON domains(is_blocked);

-- ─── IP Intelligence Table ──────────────────────────
CREATE TABLE IF NOT EXISTS ip_intelligence (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address  INET NOT NULL UNIQUE,
    risk_score  INTEGER NOT NULL DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    malicious   BOOLEAN DEFAULT false,
    categories  TEXT[] DEFAULT '{}',
    confidence  NUMERIC(4,3) DEFAULT 0.0 CHECK (confidence >= 0 AND confidence <= 1),
    country     VARCHAR(100),
    region      VARCHAR(100),
    isp         VARCHAR(200),
    is_blocked  BOOLEAN DEFAULT false,
    first_seen  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ip_intelligence_ip ON ip_intelligence(ip_address);
CREATE INDEX idx_ip_intelligence_malicious ON ip_intelligence(malicious);
CREATE INDEX idx_ip_intelligence_is_blocked ON ip_intelligence(is_blocked);

-- ─── Apps Table ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS apps (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_name    VARCHAR(255) NOT NULL UNIQUE,
    app_name        VARCHAR(255),
    privacy_score   INTEGER DEFAULT 50 CHECK (privacy_score >= 0 AND privacy_score <= 100),
    risk_level      VARCHAR(20) DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    tracker_count   INTEGER DEFAULT 0,
    known_sdks      TEXT[] DEFAULT '{}',
    permissions     TEXT[] DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_apps_package_name ON apps(package_name);
CREATE INDEX idx_apps_risk_level ON apps(risk_level);

-- ─── Reports Table ──────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id       UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    session_id      VARCHAR(255) NOT NULL,
    privacy_score   INTEGER CHECK (privacy_score >= 0 AND privacy_score <= 100),
    alerts_count    INTEGER DEFAULT 0,
    top_apps        JSONB DEFAULT '[]',
    report_date     DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_device_id ON reports(device_id);
CREATE INDEX idx_reports_session_id ON reports(session_id);
CREATE INDEX idx_reports_report_date ON reports(report_date);

-- ─── Alerts Reference Table ─────────────────────────
CREATE TABLE IF NOT EXISTS alerts_reference (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_code      VARCHAR(100) NOT NULL UNIQUE,
    description     TEXT NOT NULL,
    risk            VARCHAR(20) NOT NULL DEFAULT 'Medium' CHECK (risk IN ('Low', 'Medium', 'High', 'Critical')),
    recommendation  TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_alerts_reference_code ON alerts_reference(alert_code);

-- ─── Intelligence Versions Table ─────────────────────
CREATE TABLE IF NOT EXISTS intelligence_versions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blocklist_version   VARCHAR(50) NOT NULL,
    geoip_version       VARCHAR(50) NOT NULL,
    rules_version       VARCHAR(50) NOT NULL,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Updated At Trigger ─────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_devices_updated_at
    BEFORE UPDATE ON devices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_domains_updated_at
    BEFORE UPDATE ON domains
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_ip_intelligence_updated_at
    BEFORE UPDATE ON ip_intelligence
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_apps_updated_at
    BEFORE UPDATE ON apps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_alerts_reference_updated_at
    BEFORE UPDATE ON alerts_reference
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
