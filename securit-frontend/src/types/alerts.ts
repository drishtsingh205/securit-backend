import { z } from 'zod';

export const alertSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  title: z.string(),
  description: z.string(),
  source: z.string(),
  packageName: z.string().optional(),
  status: z.enum(['active', 'dismissed', 'resolved']),
  category: z.string(),
});

export type Alert = z.infer<typeof alertSchema>;
