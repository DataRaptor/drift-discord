import express from 'express'
import { User } from '../models'
import { logger } from '../services'
import { verifySignature } from '../utils'

export const getDiscordUserHandler = async (
      req: express.Request,
      res: express.Response
) => {
      try {
            const signature = req.query.signature as string
            const publicKey = req.query.publicKey as string
            if (verifySignature(publicKey, signature)) {
                  const query = await User.find({
                        public_key: publicKey,
                  })
                  // Take the last document found. We should instead add a datetime to each user model but no time left...
                  const user = query[query.length - 1]
                  logger.info(
                        `/v1/get_discord_user successfully returned a user with public key: ${publicKey}`
                  )
                  res.status(200).json({
                        ok: true,
                        message: 'Welcome back!',
                        user: user,
                  })
            } else {
                  logger.info(
                        `/v1/get_discord_user successfully returned a user with public key: ${publicKey}`
                  )
                  res.status(200).json({
                        ok: true,
                        message: 'Connect your discord to get all of the benefits of Drift discord.',
                  })
            }
      } catch (error) {
            logger.error(
                  `/v1/create_discord_user failed with error ${error.message}`
            )
            res.status(500).json({
                  ok: false,
                  message: 'Could not get user data',
            })
      }
}
