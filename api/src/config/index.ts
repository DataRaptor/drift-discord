require('dotenv').config()

export const PORT = process.env.PORT || 8080
export const DISCORD_CLIENT_ID: string = process.env.DISCORD_CLIENT_ID || ''
export const DISCORD_SECRET: string = process.env.DISCORD_SECRET || ''
export const DISCORD_REDIRECT_URI: string =
  process.env.DISCORD_REDIRECT_URI || ''
export const DRIFT_MESSAGE: string =
  process.env.DRIFT_MESSAGE || 'Default Drift Message'
export const MONGO_CONN_STRING: string = process.env.MONGO_CONN_STRING || ''
export const CLIENT_URL: string =
  process.env.CLIENT_URL || 'http://localhost:3000'

  console.log(DISCORD_CLIENT_ID)
  console.log(DISCORD_SECRET)