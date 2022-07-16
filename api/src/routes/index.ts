// If I had more time i'd seperate these out into controllers so that
// the logic is less confusing and so that we don't end up in try-catch if/else hell.

import express from 'express'
import axios from 'axios'
import { sign } from 'tweetnacl'
import bs58 from 'bs58'
import url from 'url'
import { User } from '../models'
import { logger } from '../services/logger'

import {
  DISCORD_API,
  DISCORD_CLIENT_ID,
  DISCORD_SECRET,
  DISCORD_REDIRECT_URI,
  DRIFT_MESSAGE,
  CLIENT_URL,
} from '../config'

export const getDiscordRedirectRoute = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { code } = req.query
    const urlSearchParams = new url.URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_SECRET,
      grant_type: 'authorization_code',
      code: code.toString(),
      redirect_uri: DISCORD_REDIRECT_URI,
    }).toString()
    const tokenResponse = await axios.post(
      `${DISCORD_API}/oauth2/token`,
      urlSearchParams,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )
    const { access_token } = tokenResponse.data
    logger.info('/v1/discord_redirect executed successfully.')
    res.redirect(`${CLIENT_URL}?access_token=${access_token}`)
  } catch (error) {
    logger.error(`/v1/discord_redirect failed with error: ${error}`)
    res.redirect(CLIENT_URL)
  }
}

export const postCreateDiscordRedirectRoute = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { accessToken, signature, publicKey } = req.body
    const message = new TextEncoder().encode(DRIFT_MESSAGE)
    if (
      sign.detached.verify(
        message,
        bs58.decode(signature),
        bs58.decode(publicKey)
      )
    ) {
      const userResponse = await axios.get(`${DISCORD_API}/users/@me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const discordUserData = userResponse.data
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
          message: message,
          ...discordUserData,
        })
        await user
          .save()
          .then(() =>
            logger.info(
              `/v1/create_discord_user A user with public key: ${publicKey} was created.`
            )
          )
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
    logger.error(`/v1/create_discord_user failed with error ${error.message}`)
    res.status(500).json({
      ok: false,
      message: 'Something went wrong. Please try again.',
    })
  }
}

export const getDiscordUserRoute = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const signature = req.query.signature as string
    const publicKey = req.query.publicKey as string
    const message = new TextEncoder().encode(DRIFT_MESSAGE)
    if (
      sign.detached.verify(
        message,
        bs58.decode(signature),
        bs58.decode(publicKey)
      )
    ) {
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
        message:
          'Connect your discord to get all of the benefits of Drift discord.',
      })
    }
  } catch (error) {
    logger.error(`/v1/create_discord_user failed with error ${error.message}`)
    res.status(500).json({
      ok: false,
      message: 'Could not get user data',
    })
  }
}
