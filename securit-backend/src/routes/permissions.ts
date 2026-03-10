import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { query, queryOne } from '../config/database';
import { logger } from '../config/logger';

interface PermissionParams {
  package_name: string;
}

interface PermissionRequest {
  package_name: string;
  permission_type: string;
  status: 'granted' | 'denied' | 'prompt';
}

export async function permissionsRoutes(fastify: FastifyInstance): Promise<void> {
  // All permission routes require authentication
  fastify.addHook('onRequest', fastify.authenticate);

  /**
   * GET /v1/permissions/:package_name
   * Get all tracked permissions for a specific app
   */
  fastify.get<{ Params: PermissionParams }>(
    '/:package_name',
    {
      schema: {
        description: 'Get app permission status for personal data access',
        tags: ['Permissions'],
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
            type: 'array',
            items: {
              type: 'object',
              properties: {
                permission_type: { type: 'string' },
                status: { type: 'string' },
                updated_at: { type: 'string' },
              },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Params: PermissionParams }>, reply: FastifyReply) => {
      const { package_name } = request.params;

      try {
        const results = await query(
          'SELECT permission_type, status, updated_at FROM personal_data_permissions WHERE package_name = $1',
          [package_name]
        );

        return reply.send(results);
      } catch (err) {
        logger.error({ err, package_name }, 'Permission lookup failed');
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    }
  );

  /**
   * POST /v1/permissions/request
   * Track or update a permission status for an app
   */
  fastify.post<{ Body: PermissionRequest }>(
    '/request',
    {
      schema: {
        description: 'Update or track a personal data permission status',
        tags: ['Permissions'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['package_name', 'permission_type', 'status'],
          properties: {
            package_name: { type: 'string' },
            permission_type: { type: 'string' },
            status: { type: 'string', enum: ['granted', 'denied', 'prompt'] },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: PermissionRequest }>, reply: FastifyReply) => {
      const { package_name, permission_type, status } = request.body;

      try {
        await query(
          `INSERT INTO personal_data_permissions (package_name, permission_type, status, granted_at)
           VALUES ($1, $2, $3, CASE WHEN $3 = 'granted' THEN NOW() ELSE NULL END)
           ON CONFLICT (package_name, permission_type) DO UPDATE SET
             status = EXCLUDED.status,
             granted_at = CASE WHEN EXCLUDED.status = 'granted' THEN NOW() ELSE personal_data_permissions.granted_at END,
             updated_at = NOW()`,
          [package_name, permission_type, status]
        );

        return reply.send({
          success: true,
          message: `Permission ${permission_type} for ${package_name} updated to ${status}`,
        });
      } catch (err) {
        logger.error({ err, package_name, permission_type }, 'Failed to update permission');
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    }
  );
}
