<<<<<<< Updated upstream
// This will 
// import { PublicKey } from "@solana/web3.js"

const API_URL: string = "http://localhost:8080"
=======
const API_URL: string = 'http://localhost:8080'
>>>>>>> Stashed changes

interface CreateDiscordUserRequestBody {
  publicKey: string
  signature: string
  accessToken: string
}

<<<<<<< Updated upstream
interface CreateDiscordUserResponseBody {
    ok: string
}

export const postCreateDiscordUser = async (
    body: CreateDiscordUserRequestBody
): Promise<boolean> => {
    console.log("REQUEST URL", `${API_URL}/v1/create_discord_user`)
    console.log("BODY", body)
    const response = await fetch(`${API_URL}/v1/create_discord_user`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    if (response.status != 200) return false;
    return true;
  };
  
=======
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
>>>>>>> Stashed changes
