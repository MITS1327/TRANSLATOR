import { registerAs } from '@nestjs/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';

import { KafkaConfig } from 'kafkajs';

import { decryptBase64 } from '../functions';

export const KAFKA_PROVIDER = 'KAFKA_PROVIDER';

const clientConfig: KafkaConfig = {
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: JSON.parse(process.env.KAFKA_BROKERS),
  ssl: false,
};

if (process.env.KAFKA_KEY) {
  clientConfig.ssl = {
    rejectUnauthorized: false,
    ca: [decryptBase64(process.env.CLUSTER_CRT)],
    key: decryptBase64(process.env.KAFKA_KEY),
    cert: decryptBase64(process.env.KAFKA_CRT),
  };
}

export default registerAs(
  'kafka',
  () =>
    ({
      transport: Transport.KAFKA,
      name: KAFKA_PROVIDER,
      options: {
        client: clientConfig,
        consumer: {
          groupId: process.env.KAFKA_GROUP_ID,
        },
        run: {
          partitionsConsumedConcurrently: 3,
        },
      },
    }) as KafkaOptions,
);
