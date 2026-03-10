import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { env } from '../config/env';

/** Registers @fastify/jwt and provides an authenticate decorator */
export async function authPlugin(fastify: FastifyInstance): Promise<void> {
  await fastify.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: env.JWT_ACCESS_EXPIRY,
    },
  });

  // Decorate fastify with an authenticate method
  fastify.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (_err) {
        reply.status(401).send({
          error: 'Unauthorized',
          message: 'Invalid or expired access token',
        });
      }
    }
  );
}

// Type augmentation for Fastify
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      deviceId: string;
      sub: string;
    };
    user: {
      deviceId: string;
      sub: string;
    };
  }
}
