import { FastifyInstance } from 'fastify';
import fastifyRateLimit from '@fastify/rate-limit';
import { env } from '../config/env';

/** Registers @fastify/rate-limit using Redis store */
export async function rateLimitPlugin(fastify: FastifyInstance): Promise<void> {
  await fastify.register(fastifyRateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW_MS,
    redis: {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD || undefined,
    } as any,
    keyGenerator: (request: any) => {
      // Use device ID from JWT if available, otherwise use IP
      return request.user?.deviceId || request.ip;
    },
    errorResponseBuilder: (_request: any, context: any) => {
      return {
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Try again in ${Math.ceil(context.ttl / 1000)} seconds.`,
        statusCode: 429,
        retryAfter: Math.ceil(context.ttl / 1000),
      };
    },
  });
}
