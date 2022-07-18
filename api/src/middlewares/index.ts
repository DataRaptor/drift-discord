import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import rateLimit from 'express-rate-limit'
import promMid from 'express-prometheus-middleware'
import expressPino from 'express-pino-logger'
import { logger } from '../services/logger'

export const createCorsMiddleware = () => cors()

export const createJsonMiddleware = () => express.json()

export const createBodyParserMiddleware = () =>
      bodyParser.urlencoded({
            extended: true,
      })

export const createPinoLoggerMiddleware = () =>
      expressPino({
            logger: logger,
      })

export const createPromMetricsMiddleware = () =>
      promMid({
            metricsPath: '/metrics',
            collectDefaultMetrics: true,
            requestDurationBuckets: [0.1, 0.5, 1, 1.5],
            requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
            responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
      })

export const createRateLimitMiddleware = (
      windowMs: number,
      maxRequestPerWindowMs: number
) =>
      rateLimit({
            windowMs: windowMs,
            max: maxRequestPerWindowMs,
            standardHeaders: true,
            legacyHeaders: false,
      })
