import { DiscordUserData, CensoredDiscordUserData } from "../types"
import { GDPR_EXEMPT_LOCALES} from "../config"

export const censorDiscordUserDataByLocale = (discordUserData: DiscordUserData): DiscordUserData | CensoredDiscordUserData => {
    // censor payload from countries where gdpr is applicable. The except locale list can be found in ../config.
    if (GDPR_EXEMPT_LOCALES.includes(discordUserData.locale)) return discordUserData
    return {
        username: discordUserData.username,
        discriminator: discordUserData.discriminator
    } as CensoredDiscordUserData
}