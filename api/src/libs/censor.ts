import { DiscordUserData, GDPRExemptDiscordUserData, GDPRCensoredDiscordUserData } from '../types'
import { GDPR_EXEMPT_LOCALES } from '../config'

export const censorDiscordUserDataByLocale = (
      discordUserData: DiscordUserData
): GDPRExemptDiscordUserData | GDPRCensoredDiscordUserData => {
      // censor payload from countries where gdpr is applicable. The except locale list can be found in ../config.
      if (GDPR_EXEMPT_LOCALES.includes(discordUserData.locale))
            return {
                  discord_id: discordUserData.id,
                  is_gdpr: false,
                  ...discordUserData
            } as GDPRExemptDiscordUserData
      return {
            discord_id: discordUserData.id,
            username: discordUserData.username,
            avatar: null,
            avatar_decoration:  null,
            discriminator:  null,
            public_flags:  null,
            flags:  null,
            banner:  null,
            banner_color: null,
            accent_color: null,
            locale:  null,
            mfa_enabled:  null,
            email:  null,
            verified: null,
            is_gdpr: true,
      } as GDPRCensoredDiscordUserData
}
