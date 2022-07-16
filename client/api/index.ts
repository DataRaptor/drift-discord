// This will 
// import { PublicKey } from "@solana/web3.js"

const API_URL: string = "http://localhost:8080"

interface CreateDiscordUserRequestBody {
    publicKey: string;
    signature: string;
    accessToken: string;
}

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
  