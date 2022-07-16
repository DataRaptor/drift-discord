require("dotenv").config()
import express from "express"
import bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose');
import { logger } from "./services/logger";
import { getDiscordRedirectRoute, postCreateDiscordRedirectRoute, getDiscordUserRoute} from "./routes"

const PORT = process.env.PORT || 8080;
const MONGO_CONN_STRING: string = process.env.MONGO_CONN_STRING || ""

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
    app.get('/v1/discord_redirect', getDiscordRedirectRoute)
    app.post('/v1/create_discord_user', postCreateDiscordRedirectRoute)
    app.get('/v1/get_discord_user', getDiscordUserRoute)
    app.listen(PORT, async() => logger.info("API started..."))
}

main()