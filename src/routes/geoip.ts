import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { queryOne } from '../config/database';
import { cachedQuery } from '../config/redis';
import { geoipLookupSchema } from '../schemas/validation';
import { logger } from '../config/logger';

export async function geoipRoutes(fastify: FastifyInstance): Promise<void> {
  // All geoip routes require authentication
  fastify.addHook('onRequest', fastify.authenticate);

  /**
   * POST /geoip/lookup
   * Get geographic information for an IP address
   */
  fastify.post(
    '/lookup',
    {
      schema: {
        description: 'Get geographic information for an IP address',
        tags: ['GeoIP'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['ip'],
          properties: {
            ip: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              country: { type: 'string' },
              region: { type: 'string' },
              isp: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parsed = geoipLookupSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          error: 'Validation Error',
          details: parsed.error.flatten().fieldErrors,
        });
      }

      const { ip } = parsed.data;

      try {
        const result = await cachedQuery(
          `geoip:${ip}`,
          3600, // Cache for 1 hour
          async () => {
            return queryOne<{
              country: string;
              region: string;
              isp: string;
            }>(
              'SELECT country, region, isp FROM ip_intelligence WHERE ip_address = $1',
              [ip]
            );
          }
        );

        if (!result) {
          return reply.send({
            country: 'Unknown',
            region: 'Unknown',
            isp: 'Unknown',
          });
        }

        return reply.send({
          country: result.country || 'Unknown',
          region: result.region || 'Unknown',
          isp: result.isp || 'Unknown',
        });
      } catch (err) {
        logger.error({ err, ip }, 'GeoIP lookup failed');
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    }
  );
}
