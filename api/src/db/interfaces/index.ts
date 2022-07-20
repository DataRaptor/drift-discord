import { DiscordUser } from '../models/index.entity'
import {
      GDPRExemptDiscordUserData,
      GDPRCensoredDiscordUserData,
      SolanaWalletData,
} from '../../types'

export const findDiscordUser = async (
      publicKey: string
): Promise<DiscordUser> => {
      var discordUser: DiscordUser = await DiscordUser.findOne({
            where: {
                  publicKey: publicKey,
            },
      })
      return discordUser
}

export const createDiscordUser = async (
      discordUserData: GDPRExemptDiscordUserData | GDPRCensoredDiscordUserData,
      solanaWalletData: SolanaWalletData
): Promise<DiscordUser> => {
      const discordUser: DiscordUser = await DiscordUser.create({
            discordId: discordUserData.discord_id,
            username: discordUserData.username,
            avatar: discordUserData.avatar,
            avatarDecoration: discordUserData.avatar_decoration,
            discriminator: discordUserData.discriminator,
            publicFlags: discordUserData.public_flags,
            flags: discordUserData.flags,
            banner: discordUserData.banner,
            bannerColor: discordUserData.banner_color,
            accentColor: discordUserData.accent_color,
            locale: discordUserData.locale,
            mfaEnabled: discordUserData.mfa_enabled,
            email: discordUserData.email,
            verified: discordUserData.verified,
            publicKey: solanaWalletData.public_key,
            signature: solanaWalletData.signature,
            message: solanaWalletData.message,
            isGdpr: discordUserData.is_gdpr,
      }).save()
      return discordUser
}
