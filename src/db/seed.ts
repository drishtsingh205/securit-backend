import { pool } from '../config/database';
import { logger } from '../config/logger';

async function seed(): Promise<void> {
  logger.info('Starting database seeding...');

  try {
    // ─── Seed Domains ──────────────────────────────────
    const domains = [
      { domain: 'tracker.example.com', risk_score: 87, categories: ['tracker', 'advertising'], sources: ['EasyPrivacy', 'OISD'], confidence: 0.92, is_blocked: true },
      { domain: 'ads.network.com', risk_score: 78, categories: ['advertising'], sources: ['EasyList'], confidence: 0.88, is_blocked: true },
      { domain: 'analytics.tracking.io', risk_score: 82, categories: ['tracker', 'analytics'], sources: ['EasyPrivacy', 'Disconnect'], confidence: 0.90, is_blocked: true },
      { domain: 'telemetry.sdk.net', risk_score: 65, categories: ['telemetry'], sources: ['OISD'], confidence: 0.75, is_blocked: true },
      { domain: 'pixel.adnetwork.com', risk_score: 91, categories: ['advertising', 'tracker'], sources: ['EasyList', 'EasyPrivacy', 'OISD'], confidence: 0.95, is_blocked: true },
      { domain: 'fingerprint.js.org', risk_score: 95, categories: ['fingerprinting', 'tracker'], sources: ['Disconnect', 'EasyPrivacy'], confidence: 0.97, is_blocked: true },
      { domain: 'crash.reporting.io', risk_score: 40, categories: ['analytics'], sources: ['EasyPrivacy'], confidence: 0.60, is_blocked: false },
      { domain: 'cdn.safesite.com', risk_score: 5, categories: [], sources: [], confidence: 0.10, is_blocked: false },
    ];

    for (const d of domains) {
      await pool.query(
        `INSERT INTO domains (domain, risk_score, categories, sources, confidence, is_blocked)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (domain) DO UPDATE SET
           risk_score = EXCLUDED.risk_score,
           categories = EXCLUDED.categories,
           sources = EXCLUDED.sources,
           confidence = EXCLUDED.confidence,
           is_blocked = EXCLUDED.is_blocked`,
        [d.domain, d.risk_score, d.categories, d.sources, d.confidence, d.is_blocked]
      );
    }
    logger.info(`Seeded ${domains.length} domains`);

    // ─── Seed IP Intelligence ──────────────────────────
    const ips = [
      { ip: '185.22.12.3', risk_score: 91, malicious: true, categories: ['botnet', 'malware'], confidence: 0.94, country: 'Russia', region: 'Moscow', isp: 'Evil Corp ISP', is_blocked: true },
      { ip: '185.32.12.1', risk_score: 88, malicious: true, categories: ['c2', 'malware'], confidence: 0.91, country: 'China', region: 'Beijing', isp: 'Shady Hosting', is_blocked: true },
      { ip: '45.22.10.2', risk_score: 85, malicious: true, categories: ['phishing'], confidence: 0.89, country: 'Nigeria', region: 'Lagos', isp: 'Scam Networks', is_blocked: true },
      { ip: '8.8.8.8', risk_score: 0, malicious: false, categories: [], confidence: 0.99, country: 'United States', region: 'California', isp: 'Google LLC', is_blocked: false },
      { ip: '1.1.1.1', risk_score: 0, malicious: false, categories: [], confidence: 0.99, country: 'United States', region: 'California', isp: 'Cloudflare Inc', is_blocked: false },
      { ip: '104.16.132.229', risk_score: 5, malicious: false, categories: [], confidence: 0.15, country: 'United States', region: 'California', isp: 'Cloudflare Inc', is_blocked: false },
    ];

    for (const ip of ips) {
      await pool.query(
        `INSERT INTO ip_intelligence (ip_address, risk_score, malicious, categories, confidence, country, region, isp, is_blocked)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (ip_address) DO UPDATE SET
           risk_score = EXCLUDED.risk_score,
           malicious = EXCLUDED.malicious,
           categories = EXCLUDED.categories,
           confidence = EXCLUDED.confidence,
           country = EXCLUDED.country,
           region = EXCLUDED.region,
           isp = EXCLUDED.isp,
           is_blocked = EXCLUDED.is_blocked`,
        [ip.ip, ip.risk_score, ip.malicious, ip.categories, ip.confidence, ip.country, ip.region, ip.isp, ip.is_blocked]
      );
    }
    logger.info(`Seeded ${ips.length} IP intelligence records`);

    // ─── Seed Apps ─────────────────────────────────────
    const apps = [
      { package_name: 'com.facebook.katana', app_name: 'Facebook', privacy_score: 32, risk_level: 'high', tracker_count: 19, known_sdks: ['Facebook Analytics', 'Adjust', 'Appsflyer'] },
      { package_name: 'com.instagram.android', app_name: 'Instagram', privacy_score: 35, risk_level: 'high', tracker_count: 15, known_sdks: ['Facebook Analytics', 'Leanplum', 'Adjust'] },
      { package_name: 'com.whatsapp', app_name: 'WhatsApp', privacy_score: 58, risk_level: 'medium', tracker_count: 5, known_sdks: ['Firebase Analytics', 'Google CrashLytics'] },
      { package_name: 'com.google.android.gm', app_name: 'Gmail', privacy_score: 45, risk_level: 'medium', tracker_count: 8, known_sdks: ['Firebase Analytics', 'Google Ads'] },
      { package_name: 'org.mozilla.firefox', app_name: 'Firefox', privacy_score: 82, risk_level: 'low', tracker_count: 2, known_sdks: ['Mozilla Telemetry'] },
      { package_name: 'org.signal.android', app_name: 'Signal', privacy_score: 95, risk_level: 'low', tracker_count: 0, known_sdks: [] },
      { package_name: 'com.tiktok.android', app_name: 'TikTok', privacy_score: 22, risk_level: 'critical', tracker_count: 24, known_sdks: ['Appsflyer', 'Facebook SDK', 'Google Ads', 'Pangle'] },
    ];

    for (const app of apps) {
      await pool.query(
        `INSERT INTO apps (package_name, app_name, privacy_score, risk_level, tracker_count, known_sdks)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (package_name) DO UPDATE SET
           app_name = EXCLUDED.app_name,
           privacy_score = EXCLUDED.privacy_score,
           risk_level = EXCLUDED.risk_level,
           tracker_count = EXCLUDED.tracker_count,
           known_sdks = EXCLUDED.known_sdks`,
        [app.package_name, app.app_name, app.privacy_score, app.risk_level, app.tracker_count, app.known_sdks]
      );
    }
    logger.info(`Seeded ${apps.length} app records`);

    // ─── Seed Alerts Reference ─────────────────────────
    const alerts = [
      { alert_code: 'DNS_SPIKE', description: 'Application generated abnormal DNS requests', risk: 'Medium', recommendation: 'Review the app\'s network permissions' },
      { alert_code: 'TRACKER_DETECTED', description: 'Known advertising tracker contacted', risk: 'Medium', recommendation: 'Consider blocking this tracker or uninstalling the app' },
      { alert_code: 'DATA_EXFIL', description: 'Unusual volume of data sent to external server', risk: 'High', recommendation: 'Immediately review the app permissions and consider revoking network access' },
      { alert_code: 'MALWARE_IP', description: 'Connection attempted to known malicious IP address', risk: 'Critical', recommendation: 'Block the IP immediately and scan your device for malware' },
      { alert_code: 'BACKGROUND_LEAK', description: 'App sending data while not in active use', risk: 'High', recommendation: 'Restrict background data access for this app' },
      { alert_code: 'FINGERPRINT', description: 'Browser or device fingerprinting attempt detected', risk: 'Medium', recommendation: 'Use a privacy-focused browser and enable tracking protection' },
      { alert_code: 'UNENCRYPTED', description: 'Sensitive data sent over unencrypted HTTP connection', risk: 'High', recommendation: 'Avoid using this app until the developer fixes HTTPS enforcement' },
      { alert_code: 'C2_COMM', description: 'Suspected command-and-control communication detected', risk: 'Critical', recommendation: 'Immediately uninstall the app and run a full device scan' },
      { alert_code: 'GEO_ANOMALY', description: 'Data being sent to unusual geographic location', risk: 'Medium', recommendation: 'Review which apps are connecting to servers in unexpected countries' },
      { alert_code: 'PERMISSION_ABUSE', description: 'App requesting excessive permissions beyond its function', risk: 'Medium', recommendation: 'Review and revoke unnecessary permissions in system settings' },
    ];

    for (const alert of alerts) {
      await pool.query(
        `INSERT INTO alerts_reference (alert_code, description, risk, recommendation)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (alert_code) DO UPDATE SET
           description = EXCLUDED.description,
           risk = EXCLUDED.risk,
           recommendation = EXCLUDED.recommendation`,
        [alert.alert_code, alert.description, alert.risk, alert.recommendation]
      );
    }
    logger.info(`Seeded ${alerts.length} alert reference records`);

    // ─── Seed Intelligence Versions ────────────────────
    await pool.query(
      `INSERT INTO intelligence_versions (blocklist_version, geoip_version, rules_version)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING`,
      ['2026.03.01', '2026.02', '3.1']
    );
    logger.info('Seeded intelligence version record');

    logger.info('Database seeding completed successfully');
  } catch (err) {
    logger.error({ err }, 'Seeding failed');
    throw err;
  } finally {
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
