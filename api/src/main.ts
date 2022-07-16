require("dotenv").config()
import express from "express"
import axios from "axios"
import { Request } from "node-fetch";
import { sign } from 'tweetnacl';
import url from "url"

const app = express();

const DISCORD_API: string = "https://discord.com/api/v8"

const PORT = process.env.PORT || 8080;
const DISCORD_CLIENT_ID: string = process.env.DISCORD_CLIENT_ID || ""
const DISCORD_SECRET: string = process.env.DISCORD_SECRET || ""
const DISCORD_REDIRECT_URI: string = process.env.DISCORD_REDIRECT_URI || ""
const DRIFT_MESSAGE: string = process.env.DRIFT_MESSAGE || "Default Message"

console.log({
    client_id: DISCORD_CLIENT_ID,
    client_secret: DISCORD_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: DISCORD_REDIRECT_URI
})


app.get('/v1/discord_redirect', async(req: express.Request, res: express.Response) => {
    const { code } = req.query
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
    // Now let's grab the user's access token and pass it back to the client via url parameter
    // This is a secure method because SSL will protect against query parameters in transit. 
    // However it will appear in our server logs... This is bad... We will revoke the token 
    // on the following request which should mean that this is safe provided that the user 
    // the bottom request is executed when the user returns to the page. 
    // This kind of jankness seems is only really required because we have signature verification...
    // Otherwise we'd be alright with just using our server to consume the data to the db here...
    const { access_token } = tokenResponse.data
    res.redirect(`http://localhost:3000?access_token=${access_token}`)
})

app.post('/v1/create_discord_user', async(req: express.Request, res: express.Response) => {
    // We use a post here because we're passing a fairly large payload over.

})

app.get('/v1/create_discord_user', async(req: express.Request, res: express.Response) => {
    // first let's get the auth token
    const { accessToken, signature, publicKey } = req.body

    // This is where we want to post this stuff to the Database...
    const message = new TextEncoder().encode(DRIFT_MESSAGE);
    if (sign.detached.verify(message, signature, publicKey)){
        const userResponse = await axios.get(`${DISCORD_API}/users/@me`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    res.send({'ok': true})
})

app.get('/v1/discord_user', async(req: express.Request, res: express.Response) => {

})



app.listen(PORT, () => {
    console.log("API started...")
})