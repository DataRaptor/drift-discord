const API_URL: string = 'http://localhost:8080'

interface CreateDiscordUserRequestBody {
  publicKey: string
  signature: string
  accessToken: string
}

interface GetDiscordUserRequestParams {
  publicKey: string
  signature: string
}

export const postCreateDiscordUser = async (
  body: CreateDiscordUserRequestBody
): Promise<any> => {
  const response = await fetch(`${API_URL}/v1/create_discord_user`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
  if (response.status == 200) return response
  throw Error('')
}

export const getDiscordUser = async (
  params: GetDiscordUserRequestParams
): Promise<any> => {
  const { publicKey, signature } = params
  const response = await fetch(
    `${API_URL}/v1/get_discord_user?signature=${signature}&publicKey=${publicKey}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )
  if (response.status == 200) {
    return response
  }
  throw Error('')
}
