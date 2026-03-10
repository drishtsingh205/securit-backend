import { z } from 'zod';

// ─── Auth Schemas ────────────────────────────────────
export const registerSchema = z.object({
  device_id: z.string().uuid('Invalid device_id format'),
  android_version: z.string().min(1).max(20),
  app_version: z.string().min(1).max(20),
  device_model: z.string().min(1).max(100),
});

export const refreshSchema = z.object({
  refresh_token: z.string().min(1, 'refresh_token is required'),
});

// ─── Threat Schemas ──────────────────────────────────
export const domainCheckSchema = z.object({
  domain: z
    .string()
    .min(1)
    .max(512)
    .regex(
      /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/,
      'Invalid domain format'
    ),
});

export const ipCheckSchema = z.object({
  ip: z
    .string()
    .min(1)
    .regex(
      /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
      'Invalid IPv4 address'
    ),
});

// ─── Report Schemas ──────────────────────────────────
export const reportUploadSchema = z.object({
  device_id: z.string().uuid(),
  session_id: z.string().uuid(),
  privacy_score: z.number().int().min(0).max(100),
  alerts: z.number().int().min(0),
  top_apps: z.array(
    z.object({
      package: z.string().min(1).max(255),
      bytes_sent: z.number().int().min(0),
      trackers: z.number().int().min(0),
    })
  ),
});

// ─── GeoIP Schemas ───────────────────────────────────
export const geoipLookupSchema = z.object({
  ip: z
    .string()
    .min(1)
    .regex(
      /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
      'Invalid IPv4 address'
    ),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type DomainCheckInput = z.infer<typeof domainCheckSchema>;
export type IpCheckInput = z.infer<typeof ipCheckSchema>;
export type ReportUploadInput = z.infer<typeof reportUploadSchema>;
export type GeoipLookupInput = z.infer<typeof geoipLookupSchema>;
