import { z } from 'zod';

export const reportSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['privacy_audit', 'traffic_analysis', 'threat_assessment', 'compliance']),
  status: z.enum(['generating', 'completed', 'failed']),
  createdAt: z.string(),
  completedAt: z.string().optional(),
  fileSize: z.string().optional(),
  summary: z.string().optional(),
});

export type Report = z.infer<typeof reportSchema>;
