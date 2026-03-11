import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { queryOne } from '../config/database';
import { cachedQuery } from '../config/redis';
import { logger } from '../config/logger';

export async function updatesRoutes(fastify: FastifyInstance): Promise<void> {
  // All update routes require authentication
  fastify.addHook('onRequest', fastify.authenticate);

  /**
   * GET /updates/check
   * Check for intelligence database updates
   */
  fastify.get(
    '/check',
    {
      schema: {
        description: 'Check for intelligence database updates',
        tags: ['Updates'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              blocklist_version: { type: 'string' },
              geoip_version: { type: 'string' },
              rules_version: { type: 'string' },
            },
          },
        },
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      try {
        const result = await cachedQuery(
          'updates:versions',
          120, // Cache for 2 minutes
          async () => {
            return queryOne<{
              blocklist_version: string;
              geoip_version: string;
              rules_version: string;
            }>(
              'SELECT blocklist_version, geoip_version, rules_version FROM intelligence_versions ORDER BY updated_at DESC LIMIT 1'
            );
          }
        );

        if (!result) {
          return reply.send({
            blocklist_version: '0.0.0',
            geoip_version: '0.0',
            rules_version: '0.0',
          });
        }

        return reply.send({
          blocklist_version: result.blocklist_version,
          geoip_version: result.geoip_version,
          rules_version: result.rules_version,
        });
      } catch (err) {
        logger.error({ err }, 'Update check failed');
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    }
  );
}
