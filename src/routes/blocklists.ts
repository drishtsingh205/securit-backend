import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { query } from '../config/database';
import { cachedQuery } from '../config/redis';
import { logger } from '../config/logger';

export async function blocklistRoutes(fastify: FastifyInstance): Promise<void> {
  // All blocklist routes require authentication
  fastify.addHook('onRequest', fastify.authenticate);

  /**
   * GET /blocklists/domains
   * Download tracker domain blocklist
   */
  fastify.get(
    '/domains',
    {
      schema: {
        description: 'Download tracker domain blocklist',
        tags: ['Blocklists'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              version: { type: 'string' },
              domains: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      try {
        const result = await cachedQuery(
          'blocklist:domains',
          600, // Cache for 10 minutes
          async () => {
            const domains = await query<{ domain: string }>(
              'SELECT domain FROM domains WHERE is_blocked = true ORDER BY risk_score DESC'
            );
            const version = await query<{ blocklist_version: string }>(
              'SELECT blocklist_version FROM intelligence_versions ORDER BY updated_at DESC LIMIT 1'
            );
            return {
              version: version[0]?.blocklist_version || '2026.03.01',
              domains: domains.map((d) => d.domain),
            };
          }
        );

        return reply.send(result);
      } catch (err) {
        logger.error({ err }, 'Failed to retrieve domain blocklist');
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    }
  );

  /**
   * GET /blocklists/ips
   * Download malicious IP blocklist
   */
  fastify.get(
    '/ips',
    {
      schema: {
        description: 'Download malicious IP blocklist',
        tags: ['Blocklists'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              version: { type: 'string' },
              ips: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      try {
        const result = await cachedQuery(
          'blocklist:ips',
          600,
          async () => {
            const ips = await query<{ ip_address: string }>(
              'SELECT host(ip_address) as ip_address FROM ip_intelligence WHERE is_blocked = true ORDER BY risk_score DESC'
            );
            const version = await query<{ blocklist_version: string }>(
              'SELECT blocklist_version FROM intelligence_versions ORDER BY updated_at DESC LIMIT 1'
            );
            return {
              version: version[0]?.blocklist_version || '2026.03.01',
              ips: ips.map((i) => i.ip_address),
            };
          }
        );

        return reply.send(result);
      } catch (err) {
        logger.error({ err }, 'Failed to retrieve IP blocklist');
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    }
  );
}
