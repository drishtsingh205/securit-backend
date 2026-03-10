import { z } from 'zod';

export const monitoredAppSchema = z.object({
  id: z.string(),
  packageName: z.string(),
  appName: z.string(),
  icon: z.string().optional(),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
  privacyScore: z.number(),
  connectionsToday: z.number(),
  dataTransferred: z.string(),
  lastActivity: z.string(),
  status: z.enum(['active', 'inactive', 'blocked']),
  permissions: z.array(z.string()),
});

export const connectionLogSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  destination: z.string(),
  protocol: z.string(),
  port: z.number(),
  bytesTransferred: z.number(),
  status: z.enum(['allowed', 'blocked', 'flagged']),
  encrypted: z.boolean(),
});

export const appDetailSchema = monitoredAppSchema.extend({
  description: z.string().optional(),
  version: z.string().optional(),
  installDate: z.string().optional(),
  connections: z.array(connectionLogSchema),
  trackerDomains: z.array(z.string()),
  dataCategories: z.array(
    z.object({
      category: z.string(),
      percentage: z.number(),
    })
  ),
});

export type MonitoredApp = z.infer<typeof monitoredAppSchema>;
export type ConnectionLog = z.infer<typeof connectionLogSchema>;
export type AppDetail = z.infer<typeof appDetailSchema>;
