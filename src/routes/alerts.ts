import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { queryOne } from '../config/database';
import { cachedQuery } from '../config/redis';
import { logger } from '../config/logger';

interface AlertParams {
  alert_code: string;
}

export async function alertsRoutes(fastify: FastifyInstance): Promise<void> {
  // All alert routes require authentication
  fastify.addHook('onRequest', fastify.authenticate);

  /**
   * GET /alerts/explain/:alert_code
   * Get explanation for a specific alert code
   */
  fastify.get<{ Params: AlertParams }>(
    '/explain/:alert_code',
    {
      schema: {
        description: 'Get explanation for a specific alert code',
        tags: ['Alerts'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['alert_code'],
          properties: {
            alert_code: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              alert_code: { type: 'string' },
              description: { type: 'string' },
              risk: { type: 'string' },
              recommendation: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Params: AlertParams }>, reply: FastifyReply) => {
      const { alert_code } = request.params;

      // Validate alert code format (alphanumeric + underscores only)
      if (!/^[A-Z][A-Z0-9_]{1,99}$/.test(alert_code)) {
        return reply.status(400).send({
          error: 'Validation Error',
          message: 'Invalid alert code format. Must be uppercase with underscores.',
        });
      }

      try {
        const result = await cachedQuery(
          `alert:explain:${alert_code}`,
          3600, // Cache for 1 hour
          async () => {
            return queryOne<{
              alert_code: string;
              description: string;
              risk: string;
              recommendation: string;
            }>(
              'SELECT alert_code, description, risk, recommendation FROM alerts_reference WHERE alert_code = $1',
              [alert_code]
            );
          }
        );

        if (!result) {
          return reply.status(404).send({
            error: 'Not Found',
            message: `No explanation found for alert code: ${alert_code}`,
          });
        }

        return reply.send({
          alert_code: result.alert_code,
          description: result.description,
          risk: result.risk,
          recommendation: result.recommendation,
        });
      } catch (err) {
        logger.error({ err, alert_code }, 'Alert explanation lookup failed');
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    }
  );
}
