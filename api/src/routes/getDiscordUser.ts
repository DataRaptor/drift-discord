import express from 'express'
import { DiscordUser, findDiscordUser } from '../db'
import { verifySignature } from '../libs'

export const getDiscordUserHandler = async (
      req: express.Request,
      res: express.Response
) => {
      try {
            const signature: string = String(req.query.signature)
            const publicKey: string = String(req.query.publicKey)
            if (verifySignature(publicKey, signature)) {
                  var user: DiscordUser = await findDiscordUser(publicKey)
                  res.status(200).json({
                        ok: true,
                        message: 'Welcome back!',
                        user: user,
                        error: null,
                  })
            } else {
                  res.status(500).json({
                        ok: true,
                        message: 'Invalid wallet signature',
                        error: null,
                  })
            }
      } catch (error) {
            res.status(500).json({
                  ok: false,
                  message: 'Could not get user data',
                  error: error.message,
            })
      }
}
