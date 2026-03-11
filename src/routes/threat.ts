import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { queryOne } from '../config/database';
import { cachedQuery } from '../config/redis';
import { domainCheckSchema, ipCheckSchema } from '../schemas/validation';
import { logger } from '../config/logger';

export async function threatRoutes(fastify: FastifyInstance): Promise<void> {
  // All threat routes require authentication
  fastify.addHook('onRequest', fastify.authenticate);

  /**
   * POST /threat/domain
   * Check domain reputation
   */
  fastify.post(
    '/domain',
    {
      schema: {
        description: 'Check domain reputation and threat intelligence',
        tags: ['Threat Intelligence'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['domain'],
          properties: {
            domain: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              domain: { type: 'string' },
              risk_score: { type: 'number' },
              categories: { type: 'array', items: { type: 'string' } },
              sources: { type: 'array', items: { type: 'string' } },
              confidence: { type: 'number' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parsed = domainCheckSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          error: 'Validation Error',
          details: parsed.error.flatten().fieldErrors,
        });
      }

      const { domain } = parsed.data;

      try {
        const result = await cachedQuery(
          `threat:domain:${domain}`,
          300, // Cache for 5 minutes
          async () => {
            return queryOne<{
              domain: string;
              risk_score: number;
              categories: string[];
              sources: string[];
              confidence: number;
            }>(
              'SELECT domain, risk_score, categories, sources, confidence FROM domains WHERE domain = $1',
              [domain]
            );
          }
        );

        if (!result) {
          return reply.send({
            domain,
            risk_score: 0,
            categories: [],
            sources: [],
            confidence: 0,
          });
        }

        return reply.send({
          domain: result.domain,
          risk_score: result.risk_score,
          categories: result.categories,
          sources: result.sources,
          confidence: parseFloat(String(result.confidence)),
        });
      } catch (err) {
        logger.error({ err, domain }, 'Domain threat check failed');
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    }
  );

  /**
   * POST /threat/ip
   * Check IP reputation
   */
  fastify.post(
    '/ip',
    {
      schema: {
        description: 'Check IP reputation and threat intelligence',
        tags: ['Threat Intelligence'],
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
              ip: { type: 'string' },
              risk_score: { type: 'number' },
              malicious: { type: 'boolean' },
              categories: { type: 'array', items: { type: 'string' } },
              confidence: { type: 'number' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parsed = ipCheckSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          error: 'Validation Error',
          details: parsed.error.flatten().fieldErrors,
        });
      }

      const { ip } = parsed.data;

      try {
        const result = await cachedQuery(
          `threat:ip:${ip}`,
          300,
          async () => {
            return queryOne<{
              ip_address: string;
              risk_score: number;
              malicious: boolean;
              categories: string[];
              confidence: number;
            }>(
              'SELECT ip_address, risk_score, malicious, categories, confidence FROM ip_intelligence WHERE ip_address = $1',
              [ip]
            );
          }
        );

        if (!result) {
          return reply.send({
            ip,
            risk_score: 0,
            malicious: false,
            categories: [],
            confidence: 0,
          });
        }

        return reply.send({
          ip: result.ip_address,
          risk_score: result.risk_score,
          malicious: result.malicious,
          categories: result.categories,
          confidence: parseFloat(String(result.confidence)),
        });
      } catch (err) {
        logger.error({ err, ip }, 'IP threat check failed');
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    }
  );
}
