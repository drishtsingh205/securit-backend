import { Kafka, Producer, Consumer, logLevel } from 'kafkajs';
import { env } from './env';
import { logger } from './logger';

const kafka = new Kafka({
  clientId: env.KAFKA_CLIENT_ID,
  brokers: env.KAFKA_BROKERS,
  logLevel: logLevel.WARN,
  retry: {
    initialRetryTime: 300,
    retries: 8,
  },
});

let producer: Producer | null = null;
let consumer: Consumer | null = null;

export async function getProducer(): Promise<Producer> {
  if (!producer) {
    producer = kafka.producer();
    await producer.connect();
    logger.info('Kafka producer connected');
  }
  return producer;
}

export async function getConsumer(groupId: string): Promise<Consumer> {
  if (!consumer) {
    consumer = kafka.consumer({ groupId });
    await consumer.connect();
    logger.info({ groupId }, 'Kafka consumer connected');
  }
  return consumer;
}

export async function publishEvent(topic: string, message: Record<string, any>): Promise<void> {
  const prod = await getProducer();
  await prod.send({
    topic,
    messages: [
      {
        key: message.id || String(Date.now()),
        value: JSON.stringify(message),
        timestamp: String(Date.now()),
      },
    ],
  });
  logger.debug({ topic }, 'Event published to Kafka');
}

export async function disconnectKafka(): Promise<void> {
  if (producer) {
    await producer.disconnect();
    producer = null;
  }
  if (consumer) {
    await consumer.disconnect();
    consumer = null;
  }
  logger.info('Kafka connections closed');
}

export { kafka };
