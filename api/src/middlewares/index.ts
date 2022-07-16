import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import rateLimit from 'express-rate-limit'

export const createCorsMiddleware = () => cors()

export const createJsonMiddleware = () => express.json()

export const createBodyParserMiddleware = () =>
      bodyParser.urlencoded({
            extended: true,
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
