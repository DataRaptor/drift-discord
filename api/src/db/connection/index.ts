import { logger } from '../../services/logger'
import {
      PRODUCTION,
      MYSQL_HOST,
      MYSQL_PORT,
      MYSQL_USERNAME,
      MYSQL_PASSWORD,
      MYSQL_DB,
      GCP_CLOUD_SQL_INSTANCE,
} from '../../config'
import { createConnection } from 'typeorm'
import { DiscordUser } from '../models/index.entity'

export const connectDB = async () => {
      if (PRODUCTION) {
            await createConnection({
                  type: 'mysql',
                  port: MYSQL_PORT,
                  username: MYSQL_USERNAME,
                  password: MYSQL_PASSWORD,
                  extra: {
                        socketPath: `/cloudsql/${GCP_CLOUD_SQL_INSTANCE}`,
                  },
                  database: MYSQL_DB,
                  synchronize: true,
                  logging: false,
                  migrationsTableName: 'migrations',
                  entities: [DiscordUser],
            })
            logger.info('Production mysql cloudsql db connected')
      } else {
            await createConnection({
                  type: 'mysql',
                  host: MYSQL_HOST,
                  port: MYSQL_PORT,
                  username: MYSQL_USERNAME,
                  password: MYSQL_PASSWORD,
                  database: MYSQL_DB,
                  synchronize: true,
                  logging: false,
                  migrationsTableName: 'migrations',
                  entities: [DiscordUser],
            })
            logger.info('Development mysql local db connected')
      }
}
