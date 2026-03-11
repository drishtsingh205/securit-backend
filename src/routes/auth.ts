import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { query, queryOne } from '../config/database';
import { registerSchema, refreshSchema } from '../schemas/validation';
import { logger } from '../config/logger';
import { env } from '../config/env';

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  /**
   * POST /auth/register
   * Register an anonymous Android device and return JWT tokens
   */
  fastify.post(
    '/register',
    {
      schema: {
        description: 'Register an anonymous Android device',
        tags: ['Authentication'],
        body: {
          type: 'object',
          required: ['device_id', 'android_version', 'app_version', 'device_model'],
          properties: {
            device_id: { type: 'string', format: 'uuid' },
            android_version: { type: 'string' },
            app_version: { type: 'string' },
            device_model: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              access_token: { type: 'string' },
              refresh_token: { type: 'string' },
              expires_in: { type: 'number' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parsed = registerSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          error: 'Validation Error',
          details: parsed.error.flatten().fieldErrors,
        });
      }

      const { device_id, android_version, app_version, device_model } = parsed.data;

      try {
        // Check if device already exists
        let device = await queryOne<{ id: string; device_id: string }>(
          'SELECT id, device_id FROM devices WHERE device_id = $1',
          [device_id]
        );

        const refreshToken = uuidv4();

        if (device) {
          // Update existing device
          await query(
            `UPDATE devices SET android_version = $1, app_version = $2, device_model = $3,
             refresh_token = $4, last_seen_at = NOW() WHERE device_id = $5`,
            [android_version, app_version, device_model, refreshToken, device_id]
          );
        } else {
          // Insert new device
          const rows = await query<{ id: string }>(
            `INSERT INTO devices (device_id, android_version, app_version, device_model, refresh_token)
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [device_id, android_version, app_version, device_model, refreshToken]
          );
          device = { id: rows[0].id, device_id };
        }

        // Generate JWT access token
        const accessToken = fastify.jwt.sign(
          { deviceId: device_id, sub: device!.id },
          { expiresIn: env.JWT_ACCESS_EXPIRY }
        );

        logger.info({ device_id }, 'Device registered/authenticated');

        return reply.send({
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: env.JWT_ACCESS_EXPIRY,
        });
      } catch (err) {
        logger.error({ err, device_id }, 'Registration failed');
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    }
  );

  /**
   * POST /auth/refresh
   * Refresh access token using a valid refresh token
   */
  fastify.post(
    '/refresh',
    {
      schema: {
        description: 'Refresh access token',
        tags: ['Authentication'],
        body: {
          type: 'object',
          required: ['refresh_token'],
          properties: {
            refresh_token: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              access_token: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parsed = refreshSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          error: 'Validation Error',
          details: parsed.error.flatten().fieldErrors,
        });
      }

      const { refresh_token } = parsed.data;

      try {
        const device = await queryOne<{ id: string; device_id: string }>(
          'SELECT id, device_id FROM devices WHERE refresh_token = $1',
          [refresh_token]
        );

        if (!device) {
          return reply.status(401).send({
            error: 'Unauthorized',
            message: 'Invalid refresh token',
          });
        }

        // Update last_seen_at
        await query('UPDATE devices SET last_seen_at = NOW() WHERE id = $1', [device.id]);

        const accessToken = fastify.jwt.sign(
          { deviceId: device.device_id, sub: device.id },
          { expiresIn: env.JWT_ACCESS_EXPIRY }
        );

        return reply.send({ access_token: accessToken });
      } catch (err) {
        logger.error({ err }, 'Token refresh failed');
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    }
  );
}
