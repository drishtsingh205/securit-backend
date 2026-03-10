import { z } from 'zod';

export const dashboardStatsSchema = z.object({
  totalAppsMonitored: z.number(),
  activeConnections: z.number(),
  alertsToday: z.number(),
  criticalAlerts: z.number(),
  privacyScore: z.number(),
  dataLeaksBlocked: z.number(),
  bandwidthAnalyzed: z.string(),
  uptime: z.string(),
});

export const trafficDataPointSchema = z.object({
  timestamp: z.string(),
  inbound: z.number(),
  outbound: z.number(),
  blocked: z.number(),
  encrypted: z.number(),
});

export const threatDistributionSchema = z.object({
  category: z.string(),
  count: z.number(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;
export type TrafficDataPoint = z.infer<typeof trafficDataPointSchema>;
export type ThreatDistribution = z.infer<typeof threatDistributionSchema>;
