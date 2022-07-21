export type AuthConfig = {
      discordGeneratedUrl: string
      driftMessage: string
}

export type SolanaWalletData = {
      public_key: string
      signature: string
      message: string
}

export type DiscordUserData = {
      id: string 
      username: string 
      avatar: string | null
      avatar_decoration: string | null
      discriminator: string
      public_flags: number | null
      flags: number | null
      banner: string | null
      banner_color: string | null
      accent_color: string | null
      locale: string | null
      mfa_enabled: boolean | null
      email: string | null
      verified: boolean | null
}

export type GDPRExemptDiscordUserData = {
      discord_id: string
      username: string
      avatar: string | null
      avatar_decoration: string | null
      discriminator: string
      public_flags: number | null
      flags: number | null
      banner: string | null
      banner_color: string | null
      accent_color: string | null
      locale: string | null
      mfa_enabled: boolean | null
      email: string | null
      verified: boolean | null
      is_gdpr: boolean
}

export type GDPRCensoredDiscordUserData = {
      discord_id: string | null
      username: string | null // We want to keep this field to display it in the UI. Showing a discord Id would be confusing to the user.
      avatar: null
      avatar_decoration: null
      discriminator: null
      public_flags: null
      flags: null
      banner: null
      banner_color: null
      accent_color: null
      locale: null
      mfa_enabled: null
      email: null
      verified: null
      is_gdpr: null
}
