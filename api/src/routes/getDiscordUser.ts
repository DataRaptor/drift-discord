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
                  var queryUsers = await User.find({
                        public_key: publicKey,
                  })
                  queryUsers = queryUsers.sort(
                        (a: typeof User, b: typeof User) => {
                              b.created - a.created
                        }
                  )
                  // Each publickey is associated with a unique document in the db
                  // However a user may choose to use multiple discord accounts for a single
                  // publickey. In this case we must take the latest user document
                  const user = queryUsers[queryUsers.length - 1]
                  res.status(200).json({
                        ok: true,
                        message: 'Welcome back!',
                        user: user,
                        error: null,
                  })
            } else {
                  res.status(200).json({
                        ok: true,
                        message: 'Connect your discord to get all of the benefits of Drift discord.',
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
