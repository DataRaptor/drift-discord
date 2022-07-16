import {
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { DriftLogo, SocialsComponent } from "../components"
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const { connected } = useWallet()
  return (
    <div className={styles.container}>
      <Head>
        <title>Drift Discord</title>
        <meta
          name="description"
          content="Drift Discord helps you link your Solana wallet address to discord"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <DriftLogo />
        <SocialsComponent />
        <div style={{ marginTop: '25px' }}>
          {connected && <WalletMultiButton />}
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="http://drift.trade" target="_blank" rel="noopener noreferrer">
          <span className={styles.logo}>
            <Image
              src="/drift-logo.png"
              alt="Vercel Logo"
              width={74}
              height={25}
            />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
