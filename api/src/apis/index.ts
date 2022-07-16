import axios from 'axios'
import { ParsedQs } from 'qs'
import url from 'url'
import {
  DISCORD_CLIENT_ID,
  DISCORD_SECRET,
  DISCORD_REDIRECT_URI,
} from '../config'
import {
  DISCORD_API
} from '../constants'

export const getDiscordAccessToken = async (
  code: string | ParsedQs | string[] | ParsedQs[]
): Promise<string> => {
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
  return access_token
}

export const getDiscordUser = async (accessToken: string): Promise<any> => {
  const userResponse = await axios.get(`${DISCORD_API}/users/@me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const discordUserData = userResponse.data
  return discordUserData
}
