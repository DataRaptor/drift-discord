import axios from 'axios'
import url from 'url'
import { ParsedQs } from 'qs'
import {
      DISCORD_API,
      DISCORD_CLIENT_ID,
      DISCORD_SECRET,
      DISCORD_REDIRECT_URI,
} from '../config'
import { logger } from '../services'

export const exchangeDiscordAccessToken = async (
      code: string | ParsedQs | string[] | ParsedQs[]
): Promise<any> => {
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
      if (tokenResponse.status == 200) {
            const { access_token: accessToken } = tokenResponse.data
            return accessToken
      }
      logger.error(`Could not revoke discord access token`)
      return null
}

export const getDiscordUserData = async (accessToken: string): Promise<any> => {
      const userResponse = await axios.get(`${DISCORD_API}/users/@me`, {
            headers: {
                  Authorization: `Bearer ${accessToken}`,
            },
      })
      if (userResponse.status == 200) return userResponse.data
      logger.error(`Could not get discord data`)
      return {}
}

export const revokeDiscordAccessToken = async(accessToken: string): Promise<boolean> => {
      const urlSearchParams = new url.URLSearchParams({
            client_id: DISCORD_CLIENT_ID,
            client_secret: DISCORD_SECRET,
            token: accessToken,
      }).toString()
      const revokeResponse = await axios.post(
            `${DISCORD_API}/oauth2/token/revoke`,
            urlSearchParams.toString(),
            {
                  headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                  }
            }
      )
      if (revokeResponse.status == 200) return true
      logger.error(`Could not revoke discord access token`)
      return false
}