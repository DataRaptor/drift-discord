export type RegistrationConfig = {
      discordGeneratedUrl: string
      driftMessage: string
}

export type DiscordUserData = {
      id: string | null
      username: string | null
      avatar: string | null
      avatar_decoration: string | null
      discriminator: string | null
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
      discord_id: string | null
      username: string | null
      avatar: string | null
      avatar_decoration: string | null
      discriminator: string | null
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

export type GDPRCensoredDiscordUserData = {
      discord_id: string | null
      username: string | null // We want to keep this field to display it in the UI. Showing a discord Id would be confusing.
}
