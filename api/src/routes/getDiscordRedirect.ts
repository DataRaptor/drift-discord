import express from 'express'
import { exchangeDiscordAccessToken } from '../apis'
import { logger } from '../services'
import { encryptAccessToken } from '../utils/crypto'
import { CLIENT_URL } from '../config'

export const getDiscordRedirectHandler = async (
      req: express.Request,
      res: express.Response
) => {
      try {
            const { code } = req.query
            const accessToken: string = await exchangeDiscordAccessToken(code)
            const encryptedAccessToken: string = encryptAccessToken(accessToken)
            res.redirect(`${CLIENT_URL}?access_token=${encryptedAccessToken}`)
            logger.info('/v1/discord_redirect executed successfully.')
      } catch (error) {
            logger.error(`/v1/discord_redirect failed with error: ${error}`)
            res.redirect(CLIENT_URL)
      }
}
