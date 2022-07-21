import express from 'express'
import { logger } from './services'
import {
      getIndexHandler,
      getDiscordRedirectHandler,
      getDiscordUserHandler,
      getAuthConfigHandler,
      postDiscordUserHandler,
} from './routes'
import {
      createCorsMiddleware,
      createJsonMiddleware,
      createBodyParserMiddleware,
      createRateLimitMiddleware,
      createPromMetricsMiddleware,
      createPinoLoggerMiddleware,
} from './middlewares'
import { connectDB } from "./db"
import { PORT } from './config'

const main = async () => {
      await connectDB()
      const app = express()
      app.use(createCorsMiddleware())
      app.use(createJsonMiddleware())
      app.use(createBodyParserMiddleware())
      app.use(createPromMetricsMiddleware())
      app.use(createPinoLoggerMiddleware())
      app.get(
            '/',
            createRateLimitMiddleware(
                  1 * 60 * 1000,
                  60 // max 60 requests per 1 min per ip
            ),
            getIndexHandler
      )
      app.get(
            '/',
            createRateLimitMiddleware(
                  1 * 60 * 1000,
                  60 // max 60 requests per 1 min per up
            ),
            getIndexHandler
      )
      app.get('/v1/discord_redirect', getDiscordRedirectHandler) // No rate limit from discord
      app.get(
            '/v1/discord_user',
            createRateLimitMiddleware(
                  1 * 60 * 1000,
                  60 //  max 60 requests per 1 min per ip.
            ),
            getDiscordUserHandler
      )
      app.get(
            '/v1/auth_config',
            createRateLimitMiddleware(
                  1 * 60 * 1000,
                  30 // max 30 requests per 1 min per ip.
            ),
            getAuthConfigHandler
      )
      app.post(
            '/v1/discord_user',
            createRateLimitMiddleware(
                  1 * 60 * 1000,
                  5 // max 5 requests per 1 min per ip.
            ),
            postDiscordUserHandler
      )

      app.listen(PORT, async () =>
            logger.info(`[Drift-Discord::API] 🦾 listening on PORT: ${PORT}`)
      )
}

main()
