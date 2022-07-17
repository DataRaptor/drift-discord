import { API_URL } from '../config'

interface CreateDiscordUserRequestBody {
  publicKey: string
  signature: string
  accessToken: string
}

interface GetDiscordUserRequestParams {
  publicKey: string
  signature: string
}

export const getDiscordUser = async (
  params: GetDiscordUserRequestParams
): Promise<any> => {
  const { publicKey, signature } = params
  const response = await fetch(
    `${API_URL}/v1/discord_user?signature=${signature}&publicKey=${publicKey}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )
  if (response.status == 200) {
    return response
  }
  throw Error('GET::discord_user returned a non 200 status code.')
}

export const getRegistrationConfig = async (): Promise<any> => {
  const response = await fetch(`${API_URL}/v1/registration_config`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  if (response.status == 200) {
    const responseJson = await response.json()
    return responseJson
  }
  throw Error('GET::registration_config returned a non 200 status code.')
}

export const postCreateDiscordUser = async (
  body: CreateDiscordUserRequestBody
): Promise<any> => {
  const response = await fetch(`${API_URL}/v1/discord_user`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
  if (response.status == 200) {
    return response
  }
  throw Error('POST:discord_user return a non 200 status code.')
}
