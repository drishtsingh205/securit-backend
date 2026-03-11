import pino from 'pino';
import { env } from './env';

export const logger = pino({
  level: env.LOG_LEVEL,
  transport:
    env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  serializers: {
    req(request) {
      return {
        method: request.method,
        url: request.url,
        hostname: request.hostname,
        remoteAddress: request.ip,
      };
    },
    res(reply) {
      return {
        statusCode: reply.statusCode,
      };
    },
  },
});
