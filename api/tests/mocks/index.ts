import { DiscordUserData } from "../../src/types"

export const mockUSDiscordData = (): DiscordUserData => {
    return {
        id: "111111111111111",
        username: "Drifter",
        avatar: "Avatar",
        avatar_decoration: "Avatar Decoration",
        discriminator: "1242141",
        public_flags: 1,
        banner: "121251215",
        banner_color: "black",
        accent_color: "white",
        locale: "en-US",
        mfa_enabled: false,
        email: "drifter@drift.trade",
        verified: true
    } as DiscordUserData
}

export const mockEUDiscordData = (): DiscordUserData => {
    return {
        id: "111111111111111",
        username: "Drifter",
        avatar: "Avatar",
        avatar_decoration: "Avatar Decoration",
        discriminator: "1242141",
        public_flags: 1,
        banner: "121251215",
        banner_color: "black",
        accent_color: "white",
        locale: "en-GB",
        mfa_enabled: false,
        email: "drifter@drift.trade",
        verified: true
    } as DiscordUserData
}