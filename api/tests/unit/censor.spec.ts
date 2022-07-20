import { expect } from 'chai'
import { DiscordUserData, GDPRCensoredDiscordUserData, GDPRExemptDiscordUserData } from "../../src/types"
import { censorDiscordUserDataByLocale } from '../../src/libs'
import { mockEUDiscordData } from "../mocks"

describe('🍬  UNIT: censor', () => {
    it('censorDiscordUserDataByLocale from a non exempt country (GB)', async () => {
        const mockedEUDIscordData: DiscordUserData = mockEUDiscordData()
        const censoredEUDiscordData: GDPRCensoredDiscordUserData | GDPRExemptDiscordUserData = censorDiscordUserDataByLocale(mockedEUDIscordData)
        expect(censoredEUDiscordData.discord_id).to.eql(mockEUDiscordData.id)
        expect(censoredEUDiscordData.username).to.eql(mockedEUDIscordData.username)
        expect(censoredEUDiscordData.avatar).to.eql(null)
        expect(censoredEUDiscordData.avatar_decoration).to.eql(null)
        expect(censoredEUDiscordData.discriminator).to.eql(null)
        expect(censoredEUDiscordData.public_flags).to.eql(null)
        expect(censoredEUDiscordData.flags).to.eql(null)
        expect(censoredEUDiscordData.banner).to.eql(null)
        expect(censoredEUDiscordData.banner_color).to.eql(null)
        expect(censoredEUDiscordData.accent_color).to.eql(null)
        expect(censoredEUDiscordData.locale).to.eql(null)
        expect(censoredEUDiscordData.mfa_enabled).to.eql(null)
        expect(censoredEUDiscordData.email).to.eql(null)
        expect(censoredEUDiscordData.verified).to.eql(null)
        expect(censoredEUDiscordData.is_gdpr).to.eql(true)
    })
    it('censorDiscordUserDataByLocale from an exempt country (US)', async () => {
        const mockedEUDIscordData: DiscordUserData = mockEUDiscordData()
        const censoredEUDiscordData: GDPRCensoredDiscordUserData | GDPRExemptDiscordUserData = censorDiscordUserDataByLocale(mockedEUDIscordData)
        expect(censoredEUDiscordData.discord_id).to.eql(mockEUDiscordData.id)
        expect(censoredEUDiscordData.username).to.eql(mockedEUDIscordData.username)
        expect(censoredEUDiscordData.avatar).to.eql(mockedEUDIscordData.avatar)
        expect(censoredEUDiscordData.avatar_decoration).to.eql(mockedEUDIscordData.avatar_decoration)
        expect(censoredEUDiscordData.discriminator).to.eql(mockedEUDIscordData.discriminator)
        expect(censoredEUDiscordData.public_flags).to.eql(mockedEUDIscordData.public_flags)
        expect(censoredEUDiscordData.flags).to.eql(mockedEUDIscordData.flags)
        expect(censoredEUDiscordData.banner).to.eql(mockedEUDIscordData.banner)
        expect(censoredEUDiscordData.banner_color).to.eql(mockedEUDIscordData.banner_color)
        expect(censoredEUDiscordData.accent_color).to.eql(mockedEUDIscordData.accent_color)
        expect(censoredEUDiscordData.locale).to.eql(mockedEUDIscordData.locale)
        expect(censoredEUDiscordData.mfa_enabled).to.eql(mockedEUDIscordData.mfa_enabled)
        expect(censoredEUDiscordData.email).to.eql(mockedEUDIscordData.email)
        expect(censoredEUDiscordData.verified).to.eql(mockedEUDIscordData.verified)
        expect(censoredEUDiscordData.is_gdpr).to.eql(false)
    })

    
})