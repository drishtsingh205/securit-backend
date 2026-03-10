import Fastify from 'fastify';
import fastifyHelmet from '@fastify/helmet';
import fastifyCors from '@fastify/cors';
import fastifySensible from '@fastify/sensible';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { env } from './config/env';
import { logger } from './config/logger';
import { testConnection } from './config/database';
import { authPlugin } from './middleware/auth';
import { rateLimitPlugin } from './middleware/rateLimit';

// Route imports
import { authRoutes } from './routes/auth';
import { threatRoutes } from './routes/threat';
import { blocklistRoutes } from './routes/blocklists';
import { appsRoutes } from './routes/apps';
import { geoipRoutes } from './routes/geoip';
import { reportsRoutes } from './routes/reports';
import { alertsRoutes } from './routes/alerts';
import { updatesRoutes } from './routes/updates';

export async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      transport:
        env.NODE_ENV === 'development'
          ? {
              target: 'pino-pretty',
              options: { colorize: true, translateTime: 'HH:MM:ss Z', ignore: 'pid,hostname' },
            }
          : undefined,
    },
    trustProxy: true,
  });

  // ─── Security Headers ──────────────────────────────
  await fastify.register(fastifyHelmet, {
    contentSecurityPolicy: false,
  });

  // ─── CORS ──────────────────────────────────────────
  await fastify.register(fastifyCors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ─── Sensible defaults ────────────────────────────
  await fastify.register(fastifySensible);

  // ─── Swagger / OpenAPI Documentation ───────────────
  await fastify.register(fastifySwagger, {
    openapi: {
      openapi: '3.0.3',
      info: {
        title: 'PrivacyLens API',
        description:
          'Real-Time Behavioral Privacy Intelligence Backend API. Provides threat intelligence, tracker blocklists, app reputation, GeoIP, and report storage for the PrivacyLens Android application.',
        version: '1.0.0',
        contact: {
          name: 'PrivacyLens Team',
          url: 'https://privacylens.io',
        },
      },
      servers: [
        { url: 'https://api.privacylens.io/v1', description: 'Production' },
        { url: 'http://localhost:3000/v1', description: 'Development' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT access token obtained from /auth/register or /auth/refresh',
          },
        },
      },
    },
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  });

  // ─── Authentication Plugin ─────────────────────────
  await authPlugin(fastify);

  // ─── Rate Limiting ─────────────────────────────────
  await rateLimitPlugin(fastify);

  // ─── Health Check (no auth) ────────────────────────
  fastify.get(
    '/health',
    {
      schema: {
        description: 'Health check endpoint',
        tags: ['System'],
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              timestamp: { type: 'string' },
              version: { type: 'string' },
            },
          },
        },
      },
    },
    async (_request, reply) => {
      return reply.send({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      });
    }
  );

  // ─── API Routes (v1 prefix) ────────────────────────
  await fastify.register(
    async (v1) => {
      await v1.register(authRoutes, { prefix: '/auth' });
      await v1.register(threatRoutes, { prefix: '/threat' });
      await v1.register(blocklistRoutes, { prefix: '/blocklists' });
      await v1.register(appsRoutes, { prefix: '/apps' });
      await v1.register(geoipRoutes, { prefix: '/geoip' });
      await v1.register(reportsRoutes, { prefix: '/reports' });
      await v1.register(alertsRoutes, { prefix: '/alerts' });
      await v1.register(updatesRoutes, { prefix: '/updates' });
    },
    { prefix: '/v1' }
  );

  // ─── Global Error Handler ──────────────────────────
  fastify.setErrorHandler((error, request, reply) => {
    logger.error({ err: error, url: request.url, method: request.method }, 'Unhandled error');

    if (error.validation) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: error.message,
      });
    }

    const statusCode = error.statusCode || 500;
    return reply.status(statusCode).send({
      error: statusCode >= 500 ? 'Internal Server Error' : error.message,
      message: env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred',
    });
  });

  // ─── 404 Handler ───────────────────────────────────
  fastify.setNotFoundHandler((_request, reply) => {
    reply.status(404).send({
      error: 'Not Found',
      message: 'The requested resource does not exist',
    });
  });

  return fastify;
}

// ─── Vercel Serverless Handler ─────────────────────
let serverPromise: ReturnType<typeof buildServer> | null = null;

async function getServer() {
  if (!serverPromise) {
    serverPromise = buildServer().then(async (fastify) => {
      await fastify.ready();
      return fastify;
    });
  }
  return serverPromise;
}

// Default export for Vercel serverless functions
export default async function handler(req: any, res: any) {
  const fastify = await getServer();
  fastify.server.emit('request', req, res);
}

// ─── Local Development Server ──────────────────────
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  (async () => {
    try {
      const fastify = await buildServer();
      await testConnection();
      await fastify.listen({ port: env.PORT, host: env.HOST });

      logger.info(`PrivacyLens API server running on http://${env.HOST}:${env.PORT}`);
      logger.info(`API Documentation: http://${env.HOST}:${env.PORT}/docs`);
      logger.info(`Environment: ${env.NODE_ENV}`);

      const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
      for (const signal of signals) {
        process.on(signal, async () => {
          logger.info({ signal }, 'Shutting down gracefully...');
          await fastify.close();
          process.exit(0);
        });
      }
    } catch (err) {
      logger.error({ err }, 'Failed to start server');
      process.exit(1);
    }
  })();
}
