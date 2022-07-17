import express from 'express'
import { User } from '../models'
import { logger } from '../services/logger'
import { verifySignature, decryptAccessToken } from '../utils'
import { getDiscordUserData, revokeDiscordAccessToken } from '../apis'
import { DRIFT_MESSAGE } from '../config'

export const postDiscordUserHandler = async (
      req: express.Request,
      res: express.Response
) => {
      try {
            const { accessToken, signature, publicKey } = req.body
            const decryptedAccessToken: string = decryptAccessToken(accessToken)
            if (verifySignature(publicKey, signature)) {
                  const discordUserData = await getDiscordUserData(
                        decryptedAccessToken
                  )
                  const query = await User.find({
                        public_key: publicKey,
                        ...discordUserData,
                  })
                  if (query.length == 0) {
                        // We opt to save the discord data everytime the user comes back to us with a new public_key
                        // So that we can later associate public_keys by discord_ids. Hence this query.
                        const user: typeof User = new User({
                              public_key: publicKey,
                              signature: signature,
                              message: DRIFT_MESSAGE,
                              ...discordUserData,
                        })
                        await user
                              .save()
                              .then(() =>
                                    logger.info(
                                          `/v1/create_discord_user A user with public key: ${publicKey} was created.`
                                    )
                              )
                        await revokeDiscordAccessToken(accessToken) // finally revoke the access token
                        res.status(200).json({
                              ok: true,
                              message: "Welcome! You've successfully linked your discord to Drift.",
                        })
                  } else {
                        logger.warn(
                              `/v1/create_discord_user warning, A user with ${publicKey} attempted to create a user but is already registed.`
                        )
                        res.status(200).json({
                              ok: false,
                              message: 'Your discord is already registed with Drift. Welcome back!',
                        })
                  }
            } else {
                  logger.error(
                        `/v1/create_discord_user warning, A user with ${publicKey} attempted to use an incorrect signature`
                  )
                  res.status(500).send({
                        ok: false,
                        message: 'Invalid Signature for Public Key',
                  })
            }
      } catch (error) {
            logger.error(
                  `/v1/create_discord_user failed with error ${error.message}`
            )
            res.status(500).json({
                  ok: false,
                  message: 'Something went wrong. Please try again.',
            })
      }
}
