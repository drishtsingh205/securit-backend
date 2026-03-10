import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { queryOne } from '../config/database';
import { cachedQuery } from '../config/redis';
import { logger } from '../config/logger';

interface AppParams {
  package_name: string;
}

export async function appsRoutes(fastify: FastifyInstance): Promise<void> {
  // All app routes require authentication
  fastify.addHook('onRequest', fastify.authenticate);

  /**
   * GET /apps/reputation/:package_name
   * Get app reputation and privacy score
   */
  fastify.get<{ Params: AppParams }>(
    '/reputation/:package_name',
    {
      schema: {
        description: 'Get app reputation and privacy intelligence',
        tags: ['App Reputation'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['package_name'],
          properties: {
            package_name: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              package_name: { type: 'string' },
              privacy_score: { type: 'number' },
              risk_level: { type: 'string' },
              tracker_count: { type: 'number' },
              known_sdks: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Params: AppParams }>, reply: FastifyReply) => {
      const { package_name } = request.params;

      // Validate package name format
      if (!/^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/.test(package_name)) {
        return reply.status(400).send({
          error: 'Validation Error',
          message: 'Invalid package name format',
        });
      }

      try {
        const result = await cachedQuery(
          `app:reputation:${package_name}`,
          600,
          async () => {
            return queryOne<{
              package_name: string;
              privacy_score: number;
              risk_level: string;
              tracker_count: number;
              known_sdks: string[];
            }>(
              'SELECT package_name, privacy_score, risk_level, tracker_count, known_sdks FROM apps WHERE package_name = $1',
              [package_name]
            );
          }
        );

        if (!result) {
          return reply.status(404).send({
            error: 'Not Found',
            message: `No reputation data for package: ${package_name}`,
          });
        }

        return reply.send({
          package_name: result.package_name,
          privacy_score: result.privacy_score,
          risk_level: result.risk_level,
          tracker_count: result.tracker_count,
          known_sdks: result.known_sdks,
        });
      } catch (err) {
        logger.error({ err, package_name }, 'App reputation lookup failed');
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    }
  );
}
