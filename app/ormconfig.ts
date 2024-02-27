import { DataSource } from 'typeorm';

import { databaseConfig } from '@translator/shared/configs/db.config';

const connectDB = new DataSource(databaseConfig);

connectDB
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized');
  })
  .catch((err) => {
    console.error('Data Source initialization error', err);
  });

export default connectDB;
