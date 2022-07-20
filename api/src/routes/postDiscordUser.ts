import express from 'express'
import { User } from '../models'
import { logger } from '../services/logger'
import { verifySignature, decryptAccessToken } from '../utils'
import { getDiscordUserData, revokeDiscordAccessToken } from '../apis'
import {
      GDPRCensoredDiscordUserData,
      GDPRExemptDiscordUserData,
      DiscordUserData,
      SolanaWalletData,
} from '../types'
import { DRIFT_MESSAGE } from '../config'
import { censorDiscordUserDataByLocale } from '../libs'
import { createDiscordUser, findDiscordUser } from '../db'

export const postDiscordUserHandler = async (
      req: express.Request,
      res: express.Response
) => {
      // try {
      const { accessToken, signature, publicKey } = req.body
      const decryptedAccessToken: string = decryptAccessToken(accessToken)
      if (verifySignature(publicKey, signature)) {
            const discordUserData = await getDiscordUserData(
                  decryptedAccessToken
            )
            const existingUser = await findDiscordUser(publicKey)
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
                  await createDiscordUser(
                        censoredDiscordUserData,
                        solanaWalletData
                  )
                  await revokeDiscordAccessToken(accessToken)
                  res.status(200).json({
                        ok: true,
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
      // } catch (error) {
      //       res.status(500).json({
      //             ok: false,
      //             message: 'Something went wrong. Please try again.',
      //             error: error.message,
      //       })
      // }
}
