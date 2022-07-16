import express from 'express'
import { logger, connectDB } from './services'
import {
      getDiscordRedirectHandler,
      getDiscordUserHandler,
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
      app.post(
            '/v1/create_discord_user',
            createRateLimitMiddleware(
                  1 * 60 * 1000,
                  5 // 5 requests per 1 mins per ip.
            ),
            postDiscordUserHandler
      )
      app.get(
            '/v1/get_discord_user',
            createRateLimitMiddleware(
                  1 * 60 * 1000,
                  15 //  15 requests per 1 mins per ip.
            ),
            getDiscordUserHandler
      )
      app.listen(PORT, async () => logger.info('API started...'))
}

main()
