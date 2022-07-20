const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
      discord_id: String,
      username: String,
      avatar: String,
      avatar_decoration: String,
      discriminator: String,
      public_flags: Number,
      flags: Number,
      banner: String,
      banner_color: String,
      accent_color: String,
      locale: String,
      mfa_enabled: Boolean,
      email: String,
      verified: Boolean,
      public_key: String,
      signature: String,
      message: String,
      is_gdpr: Boolean,
      created: { type: Date, default: Date.now },
})

import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'discord_users' })
export class DiscordUser extends BaseEntity {
      @PrimaryGeneratedColumn('uuid')
      id: string

      @Column()
      discordId: string

      @Column()
      username: string

      @Column({ nullable: true })
      avatar: string

      @Column({ nullable: true })
      avatarDecoration: string

      @Column({ nullable: true })
      discriminator: string

      @Column({ nullable: true })
      publicFlags: number

      @Column({ nullable: true })
      flags: number

      @Column({ nullable: true })
      banner: string

      @Column({ nullable: true })
      bannerColor: string

      @Column({ nullable: true })
      accentColor: string

      @Column({ nullable: true })
      locale: string

      @Column({ nullable: true })
      mfaEnabled: boolean

      @Column({ nullable: true })
      email: string

      @Column({ nullable: true })
      verified: boolean

      @Column()
      publicKey: string

      @Column()
      signature: string

      @Column({ type: 'text' })
      message: string

      @Column()
      isGdpr: boolean

      @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
      created: Date
}

export const User = mongoose.model('User', userSchema)
