import pino from 'pino'
import { LOG_LEVEL } from '../config'

const options = {
      colorize: true,
      translateTime: true,
      singleLine: true,
}

const logger = pino({
      transport: {
            target: 'pino-pretty',
            options: options,
      },
})

logger.level = LOG_LEVEL

export { logger }
