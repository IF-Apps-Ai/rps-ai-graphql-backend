import { DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Dosen } from '../dosen/entities/dosen.entity';
import { Settings } from '../settings/entities/settings.entity';
import { BahanAjarLog } from '../bahan-ajar/entities/bahan-ajar-log.entity';
import { RpsLog } from '../rps/entities/rps-log.entity';

export const DatabaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const maxRetries = process.env.DB_MAX_RETRIES
        ? parseInt(process.env.DB_MAX_RETRIES)
        : 5;
      let retries = 0;
      const baseDelay = process.env.DB_RETRY_DELAY
        ? parseInt(process.env.DB_RETRY_DELAY)
        : 2000; // in milliseconds

      while (retries < maxRetries) {
        try {
          const dataSource = new DataSource({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: parseInt(process.env.POSTGRES_PORT)
              ? parseInt(process.env.POSTGRES_PORT)
              : 5432,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
            entities: [Settings, BahanAjarLog, RpsLog, User],
            synchronize: false,
            poolSize: 2,
          });

          await dataSource.initialize();
          console.log('Main Database connected successfully');
          return dataSource;
        } catch (error) {
          retries += 1;
          console.error(
            `Main Database connection failed (Attempt ${retries}/${maxRetries}):`,
            error,
          );

          if (retries >= maxRetries) {
            console.error('Max retries reached. Exiting application.');
            process.exit(1); // Exit the application
          }

          // Exponential backoff before retrying
          const delay = baseDelay * Math.pow(2, retries - 1); // retries - 1 because retries was incremented
          console.log(`Waiting for ${delay}ms before next retry...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    },
  },
  {
    provide: 'SIMAK_DATA_SOURCE',
    useFactory: async () => {
      const maxRetries = process.env.DB_MAX_RETRIES
        ? parseInt(process.env.DB_MAX_RETRIES)
        : 5;
      let retries = 0;
      const retryDelay = process.env.DB_RETRY_DELAY
        ? parseInt(process.env.DB_RETRY_DELAY)
        : 2000; // in milliseconds

      while (retries < maxRetries) {
        try {
          const simakDataSource = new DataSource({
            name: 'simak',
            type: 'mysql',
            host: process.env.SIMAK_MYSQL_HOST,
            port: process.env.SIMAK_MYSQL_PORT
              ? parseInt(process.env.SIMAK_MYSQL_PORT)
              : 3306,
            username: process.env.SIMAK_MYSQL_USER,
            password: process.env.SIMAK_MYSQL_PASSWORD,
            database: process.env.SIMAK_MYSQL_DATABASE,
            entities: [Dosen],
            synchronize: false,
            poolSize: 3,
          });

          await simakDataSource.initialize();
          console.log('Database SIMAK connected successfully');
          return simakDataSource;
        } catch (error) {
          retries += 1;
          console.error(
            `Database SIMAK connection failed (Attempt ${retries}/${maxRetries}):`,
            error,
          );

          if (retries >= maxRetries) {
            console.error('Max retries reached. Exiting application.');
            process.exit(1); // Exit the application
          }

          // Wait before retrying
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    },
  },
];
