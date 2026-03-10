import { redis } from './redis';
import { logger } from './logger';

/**
 * Lightweight event queue using Redis Lists.
 * Replaces Kafka — zero extra dependencies, works perfectly in serverless.
 * Events are pushed to a Redis list and can be consumed by a worker later.
 */

/** Publish an event to a Redis-backed queue */
export async function publishEvent(queue: string, message: Record<string, any>): Promise<void> {
  try {
    const payload = JSON.stringify({
      ...message,
      _publishedAt: new Date().toISOString(),
    });
    await redis.lpush(`queue:${queue}`, payload);
    logger.debug({ queue }, 'Event published to Redis queue');
  } catch (err) {
    logger.warn({ err, queue }, 'Failed to publish event to queue (non-critical)');
  }
}

/** Consume one event from a Redis-backed queue (for worker scripts) */
export async function consumeEvent<T = Record<string, any>>(queue: string): Promise<T | null> {
  const data = await redis.rpop(`queue:${queue}`);
  if (!data) return null;
  return JSON.parse(data) as T;
}

/** Get the length of a queue */
export async function getQueueLength(queue: string): Promise<number> {
  return redis.llen(`queue:${queue}`);
}
