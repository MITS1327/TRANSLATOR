import commonConfig from './common.config';
import dbConfig from './db.config';
import kafkaConfig from './kafka.config';
import pootleConfig from './pootle.config';
import redisConfig from './redis.config';

export default [dbConfig, commonConfig, kafkaConfig, redisConfig, pootleConfig];

export * from './kafka.config';
