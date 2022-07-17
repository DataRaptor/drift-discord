import express from 'express'
import { logger, connectDB } from './services'
import {
      getDiscordRedirectHandler,
      getDiscordUserHandler,
      getRegistrationConfigHandler,
      postDiscordUserHandler,
} from './routes'
import {
      createCorsMiddleware,
      createJsonMiddleware,
      createBodyParserMiddleware,
      createRateLimitMiddleware,
} from './middlewares'
import { PORT } from './config'

const main = async () => {
      await connectDB()
      const app = express()
      app.use(createCorsMiddleware())
      app.use(createJsonMiddleware())
      app.use(createBodyParserMiddleware())
      app.get('/v1/discord_redirect', getDiscordRedirectHandler)
      app.get(
            '/v1/discord_user',
            createRateLimitMiddleware(
                  1 * 60 * 1000,
                  60 //  max 60 requests per 1 mins per ip.
            ),
            getDiscordUserHandler
      )
      app.get(
            '/v1/registration_config',
            createRateLimitMiddleware(
                  1 * 60 * 1000,
                  30 // max 30 requests per 1 min per ip.
            ),
            getRegistrationConfigHandler
      )
      app.post(
            '/v1/discord_user',
            createRateLimitMiddleware(
                  1 * 60 * 1000,
                  5 // max 5 requests per 1 mins per ip.
            ),
            postDiscordUserHandler
      )
      
      app.listen(PORT, async () => logger.info(`🦾 [Drift-Discord::API] listening on PORT: ${PORT}`))
}

main()
