import express from 'express'
import { findDiscordUser } from '../db'
import { User, DiscordUser } from '../models'
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
                  var user = await findDiscordUser(publicKey)
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
