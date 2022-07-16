require("dotenv").config()
import express from "express"
import axios from "axios"
import bodyParser = require('body-parser')
import { sign } from 'tweetnacl';
const cors = require('cors')
import bs58 from "bs58"
import url from "url"
const mongoose = require('mongoose');
import { User } from "./models"

const DISCORD_API: string = "https://discord.com/api/v8"

const PORT = process.env.PORT || 8080;
const DISCORD_CLIENT_ID: string = process.env.DISCORD_CLIENT_ID || ""
const DISCORD_SECRET: string = process.env.DISCORD_SECRET || ""
const DISCORD_REDIRECT_URI: string = process.env.DISCORD_REDIRECT_URI || ""
const DRIFT_MESSAGE: string = process.env.DRIFT_MESSAGE || "Default Drift Message"
const MONGO_CONN_STRING: string = process.env.MONGO_CONN_STRING || ""
const CLIENT_URL: string = process.env.CLIENT_URL || "http://localhost:3000"

const main = async() => {
    await mongoose.connect(MONGO_CONN_STRING);
    const app = express();
    app.use(
        bodyParser.urlencoded({
        extended: true,
    })
    )
    app.use(express.json())
    app.use(cors())

    app.get('/v1/discord_redirect', async(req: express.Request, res: express.Response) => {
        try {
            const { code } = req.query
            const urlSearchParams = new url.URLSearchParams({
                client_id: DISCORD_CLIENT_ID,
                client_secret: DISCORD_SECRET,
                grant_type: 'authorization_code',
                code: code.toString(),
                redirect_uri: DISCORD_REDIRECT_URI
            }).toString()
            const tokenResponse = await axios.post(`${DISCORD_API}/oauth2/token`, urlSearchParams,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            const { access_token } = tokenResponse.data
            res.redirect(`${CLIENT_URL}?access_token=${access_token}`)
        } catch(error) {
            // If something goes wrong, send them back to the client
            res.redirect(CLIENT_URL)
        }
    })


    app.post('/v1/create_discord_user', async(req: express.Request, res: express.Response) => {
        try{
            const { accessToken, signature, publicKey } = req.body
            const message = new TextEncoder().encode(DRIFT_MESSAGE);
            if (sign.detached.verify(message, bs58.decode(signature), bs58.decode(publicKey))){
                const userResponse = await axios.get(`${DISCORD_API}/users/@me`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                const discordUserData = userResponse.data
                const query = await User.find({
                    public_key: publicKey,
                    ...discordUserData
                })
                if (query.length == 0){
                    // We opt to save the discord data everytime the user comes back to us with a new public_key
                    // So that we can later associate public_keys by discord_ids. Hence this query.
                    const user: typeof User = new User({
                        public_key: publicKey,
                        signature: signature,
                        message: message,
                        ...discordUserData
                    })
                    await user.save().then(() => console.log("saved!!!"))
                    res.status(200).json({
                        "ok": true,
                        "message": "Welcome! You've successfully linked your discord to Drift."
                    })
                } else {
                    res.status(200).json({
                        "ok": false,
                        "message": "Your discord is already registed with Drift!"
                    })
                }
            } else {
                res.status(500).send({
                    "ok": false,
                    "message": "Invalid Signature for Public Key" 
                })
            }
        } catch(error) {
            res.status(500).json({
                "ok": false,
                "message": "Something went wrong. Please try again."
            })
        }
    })

    app.listen(PORT, async() => console.log("API started..."))
}

main()