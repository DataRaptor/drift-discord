import express from 'express'
import { logger } from '../services'
import { RegistrationConfig } from "../types"
import { DISCORD_GENERATED_URL, DRIFT_MESSAGE } from '../config'

export const getRegistrationConfigHandler = async (
      _req: express.Request,
      res: express.Response
) => {
      try {
            const registrationConfig: RegistrationConfig = {
                  discordGeneratedUrl: DISCORD_GENERATED_URL,
                  driftMessage: DRIFT_MESSAGE
            }
            res.status(200).json({
                  ok: true,
                  message: "success",
                  registrationConfig: registrationConfig
            })
            logger.info('/v1/registration_config executed successfully.')
      } catch (error) {
            logger.error(`/v1/registration_config failed with error: ${error}`)
            res.status(500).json({
                  ok: false,
                  message: "Could not get registration config",
                  registrationConfig: null
            })
      }
}
