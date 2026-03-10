import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { query, queryOne } from '../config/database';
import { reportUploadSchema } from '../schemas/validation';
import { publishEvent } from '../config/events';
import { logger } from '../config/logger';

export async function reportsRoutes(fastify: FastifyInstance): Promise<void> {
  // All report routes require authentication
  fastify.addHook('onRequest', fastify.authenticate);

  /**
   * POST /reports/upload
   * Upload a privacy report from the Android device
   */
  fastify.post(
    '/upload',
    {
      schema: {
        description: 'Upload optional privacy report',
        tags: ['Reports'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['device_id', 'session_id', 'privacy_score', 'alerts', 'top_apps'],
          properties: {
            device_id: { type: 'string', format: 'uuid' },
            session_id: { type: 'string', format: 'uuid' },
            privacy_score: { type: 'number' },
            alerts: { type: 'number' },
            top_apps: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  package: { type: 'string' },
                  bytes_sent: { type: 'number' },
                  trackers: { type: 'number' },
                },
              },
            },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parsed = reportUploadSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          error: 'Validation Error',
          details: parsed.error.flatten().fieldErrors,
        });
      }

      const { device_id, session_id, privacy_score, alerts, top_apps } = parsed.data;

      try {
        // Resolve internal device ID
        const device = await queryOne<{ id: string }>(
          'SELECT id FROM devices WHERE device_id = $1',
          [device_id]
        );

        if (!device) {
          return reply.status(404).send({
            error: 'Not Found',
            message: 'Device not registered',
          });
        }

        // Store report
        await query(
          `INSERT INTO reports (device_id, session_id, privacy_score, alerts_count, top_apps)
           VALUES ($1, $2, $3, $4, $5)`,
          [device.id, session_id, privacy_score, alerts, JSON.stringify(top_apps)]
        );

        // Publish event to Redis queue for async processing
        await publishEvent('privacy-reports', {
          id: session_id,
          device_id,
          privacy_score,
          alerts,
          timestamp: new Date().toISOString(),
        });

        logger.info({ session_id, device_id }, 'Privacy report uploaded');

        return reply.send({ status: 'stored' });
      } catch (err) {
        logger.error({ err }, 'Report upload failed');
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    }
  );

  /**
   * GET /reports/history
   * Retrieve previous privacy reports for the authenticated device
   */
  fastify.get(
    '/history',
    {
      schema: {
        description: 'Retrieve previous privacy reports',
        tags: ['Reports'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              reports: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    session_id: { type: 'string' },
                    date: { type: 'string' },
                    privacy_score: { type: 'number' },
                  },
                },
              },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = request.user as { deviceId: string; sub: string };

        // Resolve internal device ID
        const device = await queryOne<{ id: string }>(
          'SELECT id FROM devices WHERE device_id = $1',
          [user.deviceId]
        );

        if (!device) {
          return reply.send({ reports: [] });
        }

        const reports = await query<{
          session_id: string;
          report_date: string;
          privacy_score: number;
        }>(
          `SELECT session_id, report_date::text as report_date, privacy_score
           FROM reports WHERE device_id = $1
           ORDER BY created_at DESC LIMIT 50`,
          [device.id]
        );

        return reply.send({
          reports: reports.map((r) => ({
            session_id: r.session_id,
            date: r.report_date,
            privacy_score: r.privacy_score,
          })),
        });
      } catch (err) {
        logger.error({ err }, 'Report history retrieval failed');
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    }
  );
}
