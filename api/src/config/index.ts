require('dotenv').config()

// Non-secrets
export const PRODUCTION: boolean = process.env.PRODUCTION == 'true' || false
export const PORT: string | number = process.env.PORT || 8080
export const LOG_LEVEL: string = process.env.LOG_LEVEL || 'debug'

export const DISCORD_API: string = process.env.DISCORD_API || ''
export const DISCORD_REDIRECT_URI: string =
      process.env.DISCORD_REDIRECT_URI || ''
export const DISCORD_GENERATED_URL: string =
      process.env.DISCORD_GENERATED_URL || ''

export const CLIENT_URL: string = process.env.CLIENT_URL || ''
export const DRIFT_MESSAGE: string =
      process.env.DRIFT_MESSAGE || 'Default Drift Message'

export const GCP_CLOUD_SQL_INSTANCE: string =
      process.env.GCP_CLOUD_SQL_INSTANCE || ''
export const MYSQL_PORT: number = parseInt(process.env.MYSQL_POST) || 3306

// Secrets
export const MYSQL_HOST: string = process.env.MYSQL_HOST || ''
export const MYSQL_USERNAME: string = process.env.MYSQL_USERNAME || ''
export const MYSQL_PASSWORD: string = process.env.MYSQL_PASSWORD || ''
export const MYSQL_DB: string = process.env.MYSQL_DB || ''
export const DISCORD_CLIENT_ID: string = process.env.DISCORD_CLIENT_ID || ''
export const DISCORD_SECRET: string = process.env.DISCORD_SECRET || ''
export const AES_HTTP_TRANSPORT_SECRET: string =
      process.env.AES_HTTP_TRANSPORT_SECRET || ''

// Constants
export const GDPR_EXEMPT_LOCALES: string[] = ['en-US'] // Let's start with only the US but this list can be expanded
