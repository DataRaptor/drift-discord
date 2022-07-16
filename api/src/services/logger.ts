import pino from 'pino'

const options = {
  colorize: false,
  translateTime: true,
  ignore: 'pid,hostname',
  singleLine: false,
}

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: options,
  },
})

export { logger }
