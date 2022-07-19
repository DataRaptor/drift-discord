import { DiscordUserData, GDPRExemptDiscordUserData, GDPRCensoredDiscordUserData } from '../types'
import { GDPR_EXEMPT_LOCALES } from '../config'

export const censorDiscordUserDataByLocale = (
      discordUserData: DiscordUserData
): GDPRExemptDiscordUserData | GDPRCensoredDiscordUserData => {
      // censor payload from countries where gdpr is applicable. The except locale list can be found in ../config.
      if (GDPR_EXEMPT_LOCALES.includes(discordUserData.locale))
            return {
                  discord_id: discordUserData.id,
                  ...discordUserData
            } as GDPRExemptDiscordUserData
      return {
            discord_id: discordUserData.id,
            username: discordUserData.username
      } as GDPRCensoredDiscordUserData
}
