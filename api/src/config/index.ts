require('dotenv').config()
export const PORT = process.env.PORT || 8080
export const MONGO_CONN_STRING: string = process.env.MONGO_CONN_STRING || ''
export const DISCORD_API: string = 'https://discord.com/api/v8'
export const DISCORD_CLIENT_ID: string = process.env.DISCORD_CLIENT_ID || ''
export const DISCORD_SECRET: string = process.env.DISCORD_SECRET || ''
export const DISCORD_REDIRECT_URI: string =
  process.env.DISCORD_REDIRECT_URI || ''
export const DRIFT_MESSAGE: string =
  process.env.DRIFT_MESSAGE || `Welcome to Drift Discord! Drift’s goal is to bring a state-of-the-art trader-centric experience from centralized exchanges on-chain. We're a team of experienced traders and builders from DeFi and traditional finance working together to make this a reality.`
export const CLIENT_URL: string =
  process.env.CLIENT_URL || 'http://localhost:3000'
