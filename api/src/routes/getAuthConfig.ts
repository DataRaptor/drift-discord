import express from 'express'
import { AuthConfig } from '../types'
import { DISCORD_GENERATED_URL, DRIFT_MESSAGE } from '../config'

export const getAuthConfigHandler = async (
      _req: express.Request,
      res: express.Response
) => {
      try {
            const authConfig: AuthConfig = {
                  discordGeneratedUrl: DISCORD_GENERATED_URL,
                  driftMessage: DRIFT_MESSAGE,
            }
            res.status(200).json({
                  ok: true,
                  message: 'success',
                  authConfig: authConfig,
                  error: null,
            })
      } catch (error) {
            res.status(500).json({
                  ok: false,
                  message: 'Could not get registration config',
                  authConfig: null,
                  error: error.message,
            })
      }
}
