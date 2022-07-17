require('dotenv').config()
import { logger } from "../services"

export const PORT = process.env.PORT || 8080
export const MONGO_CONN_STRING: string = process.env.MONGO_CONN_STRING || ''

export const DISCORD_API: string = process.env.DISCORD_API || 'https://discord.com/api/v8'
export const DISCORD_CLIENT_ID: string = process.env.DISCORD_CLIENT_ID || ''
export const DISCORD_SECRET: string = process.env.DISCORD_SECRET || ''
export const DISCORD_REDIRECT_URI: string =
      process.env.DISCORD_REDIRECT_URI || ''
export const DISCORD_GENERATED_URL: string = process.env.DISCORD_GENERATED_URL || ''

export const DRIFT_MESSAGE: string =
      process.env.DRIFT_MESSAGE || 'Default Drift Message'

export const CLIENT_URL: string =
      process.env.CLIENT_URL || 'http://localhost:3000'
export const AES_HTTP_TRANSPORT_SECRET: string = process.env.AES_HTTP_TRANSPORT_SECRET || "11122233344455566677788822244455555555555555555231231321313aaaff" 

logger.error("LOGGING SOME NON SECRET ENV VARIABLES TO DEBUG DEPLOY.")

logger.error({
      "$$$ PORT": PORT
})

logger.error({
      "$$$ DISCORD_API": DISCORD_API
})

logger.error({
      "$$$ DISCORD_REDIRECT_URI": DISCORD_REDIRECT_URI
})
