import { z } from 'zod';

export const loginCredentialsSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['admin', 'analyst', 'viewer']),
  avatar: z.string().optional(),
  lastLogin: z.string().optional(),
});

export const authResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
  expiresAt: z.string(),
});

export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;
export type User = z.infer<typeof userSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
