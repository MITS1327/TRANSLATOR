import commonConfig from './common.config';
import dbConfig from './db.config';
import kafkaConfig from './kafka.config';
import keydbConfig from './keydb.config';
import pootleConfig from './pootle.config';

export default [dbConfig, commonConfig, kafkaConfig, keydbConfig, pootleConfig];

export * from './kafka.config';
