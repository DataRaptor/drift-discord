import express from 'express'
import { logger } from '../services/logger'
import { getDiscordUserData, revokeDiscordAccessToken } from '../apis'
import { verifySignature, decryptAccessToken, censorDiscordUserDataByLocale } from '../libs'
import { DiscordUser, createDiscordUser, findDiscordUser } from '../db'
import {
      GDPRCensoredDiscordUserData,
      GDPRExemptDiscordUserData,
      DiscordUserData,
      SolanaWalletData,
} from '../types'
import { DRIFT_MESSAGE } from '../config'


export const postDiscordUserHandler = async (
      req: express.Request,
      res: express.Response
) => {
      try {
            const { accessToken, signature, publicKey } = req.body
            const decryptedAccessToken: string = decryptAccessToken(accessToken)
            if (verifySignature(publicKey, signature)) {
                  const discordUserData: DiscordUserData = await getDiscordUserData(
                        decryptedAccessToken
                  )
                  const existingUser: DiscordUser = await findDiscordUser(publicKey)
                  if (!existingUser) {
                        const solanaWalletData: SolanaWalletData = {
                              signature: signature,
                              public_key: publicKey,
                              message: DRIFT_MESSAGE,
                        }
                        const censoredDiscordUserData:
                              | GDPRCensoredDiscordUserData
                              | GDPRExemptDiscordUserData =
                              censorDiscordUserDataByLocale(discordUserData)
                        const user: DiscordUser = await createDiscordUser(
                              censoredDiscordUserData,
                              solanaWalletData
                        )
                        await revokeDiscordAccessToken(accessToken)
                        res.status(200).json({
                              ok: true,
                              user: user,
                              message: "Welcome! You've successfully linked your discord to Drift.",
                              error: null,
                        })
                  } else {
                        logger.warn(
                              `A user with ${publicKey} attempted to create a user but is already registed.`
                        )
                        res.status(200).json({
                              ok: false,
                              message: 'Your discord is already registed with Drift. Welcome back!',
                              error: null,
                        })
                  }
            } else {
                  res.status(500).send({
                        ok: false,
                        message: 'Invalid Signature for Public Key',
                        error: `A user with ${publicKey} attempted to use an incorrect signature`,
                  })
            }
      } catch (error) {
            res.status(500).json({
                  ok: false,
                  message: 'Something went wrong. Please try again.',
                  error: error.message,
            })
      }
}
