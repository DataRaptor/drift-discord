require('dotenv').config()

// Non-secrets
export const PORT: string | number = process.env.PORT || 8080
export const LOG_LEVEL: string = process.env.LOG_LEVEL || 'debug'
export const DISCORD_API: string = process.env.DISCORD_API || ''
export const CLIENT_URL: string = process.env.CLIENT_URL || ''
export const DRIFT_MESSAGE: string =
      process.env.DRIFT_MESSAGE || 'Default Drift Message'
export const DISCORD_REDIRECT_URI: string =
      process.env.DISCORD_REDIRECT_URI || ''
export const DISCORD_GENERATED_URL: string =
      process.env.DISCORD_GENERATED_URL || ''

// Secrets
export const MONGO_CONN_STRING: string = process.env.MONGO_CONN_STRING || ''
export const DISCORD_CLIENT_ID: string = process.env.DISCORD_CLIENT_ID || ''
export const DISCORD_SECRET: string = process.env.DISCORD_SECRET || ''
export const AES_HTTP_TRANSPORT_SECRET: string =
      process.env.AES_HTTP_TRANSPORT_SECRET ||
      '11122233344455566677788822244455555555555555555231231321313aaaff'

// Constants
export const GDPR_EXEMPT_LOCALES: string[] = ['en-US'] // Let's start with only the US but this list can be expanded
