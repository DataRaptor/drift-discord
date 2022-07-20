
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
