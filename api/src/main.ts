require("dotenv").config()
import express from "express"
import axios from "axios"
import { Request } from "node-fetch";
import url from "url"

// ALL in one file BBB!!!

const app = express();

const DISCORD_API: string = "https://discord.com/api/v8"

const PORT = process.env.PORT || 8080;
const DISCORD_CLIENT_ID: string = process.env.DISCORD_CLIENT_ID || ""
const DISCORD_SECRET: string = process.env.DISCORD_SECRET || ""
const DISCORD_REDIRECT_URI: string = process.env.DISCORD_REDIRECT_URI || ""

console.log({
    client_id: DISCORD_CLIENT_ID,
    client_secret: DISCORD_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: DISCORD_REDIRECT_URI
})

app.get('/v1/discord_redirect', async(req: express.Request, res: express.Response) => {
    const { code } = req.query
    // Wow.... URL encoding tripped me up for like 15 mins... no bueno....
    // first let's get the auth token
    const tokenResponse = await axios.post(`${DISCORD_API}/oauth2/token`, new url.URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_SECRET,
        grant_type: 'authorization_code',
        code: code.toString(),
        redirect_uri: DISCORD_REDIRECT_URI
    }).toString(),
    {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
    // Now let's grab the user's data with our access token response...
    const { access_token } = tokenResponse.data
    const userResponse = await axios.get(`${DISCORD_API}/users/@me`, {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    })
    // This is where we want to post this stuff to the Database ???

    // Lasty we want to revoke or
    res.send(userResponse.data)
})



app.listen(PORT, () => {
    console.log("API started...")
})