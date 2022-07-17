import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import rateLimit from 'express-rate-limit'
import pino from "express-pino-logger"

export const createCorsMiddleware = () => cors()

export const createJsonMiddleware = () => express.json()

export const createBodyParserMiddleware = () =>
      bodyParser.urlencoded({
            extended: true,
      })

export const createPinoLoggerMiddleware = () => pino()

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
