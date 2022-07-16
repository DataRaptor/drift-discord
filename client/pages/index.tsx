import { useEffect, useState } from 'react'
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { sign } from 'tweetnacl'
import bs58 from 'bs58'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import { postCreateDiscordUser, getDiscordUser } from '../api'
import { toast } from 'react-toastify'
import { fireConfetti } from '../utils/confetti'
import useSWR from 'swr'

const DISCORD_GENERATED_URL: string =
  'https://discord.com/api/oauth2/authorize?client_id=997668769570750524&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fv1%2Fdiscord_redirect&response_type=code&scope=identify%20email' // not a secret...
const DRIFT_MESSAGE: string = 'Default Drift Message'

const triggerToast = (message: string) => {
  toast(message, {
    position: 'bottom-right',
    autoClose: 7000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })
}

const DriftLogo = () => {
  return (
    <a href="http://drift.trade">
      <img className={styles.logoHeader} src="/drift-logo.png" />
    </a>
  )
}

const UserComponent = ({ discordUsername }: any) => {
  return (
    <div className={styles.userContainer}>
      <h1 className={styles.usernameText}>Discord: {discordUsername}</h1>
    </div>
  )
}

const SocialsComponent = () => {
  const router = useRouter()
  const [discordUser, setDiscordUser] = useState(null)
  const { connected, publicKey, signMessage } = useWallet()

  const executeGetDiscordUser = async () => {
    if (!publicKey) null
    const publicKeyString = publicKey?.toBase58()
    const lastSignatureString = localStorage.getItem('lastSignature')
    if (lastSignatureString && publicKeyString) {
      const response = await getDiscordUser({
        publicKey: publicKeyString,
        signature: lastSignatureString,
      })
      const responseJson = await response.json()
      return responseJson
    }
  }

  const executePostUserData = async () => {
    const { access_token } = router.query
    const lastSignatureString = localStorage.getItem('lastSignature')
    console.log('lastSignatureString', lastSignatureString)
    if (access_token && connected && lastSignatureString) {
      if (!publicKey) throw new Error('Wallet not connected!')
      const lastSignature = bs58.decode(lastSignatureString)
      const message = new TextEncoder().encode(DRIFT_MESSAGE)
      if (!sign.detached.verify(message, lastSignature, publicKey.toBytes()))
        throw new Error('Invalid signature!')
      const body = {
        publicKey: bs58.encode(publicKey.toBuffer()),
        signature: bs58.encode(lastSignature),
        accessToken: access_token,
      }
      const response = await postCreateDiscordUser(body)
      if (response.status == 200) fireConfetti()
      const responseJson = await response.json()
      console.log('DATAATA', responseJson)
      triggerToast(responseJson.message)
      router.push('/')
    }
  }

  const getDiscordUserResponse = useSWR(
    '/v1/get_discord_user',
    executeGetDiscordUser,
    {
      refreshInterval: 100,
    }
  )

  useEffect(() => {
    if (getDiscordUserResponse.data) {
      setDiscordUser(getDiscordUserResponse.data.user)
    }
  }, [getDiscordUserResponse.data])

  useEffect(() => {
    executePostUserData()
  }, [connected])

  const onConnectDiscordClick = async () => {
    if (!publicKey) throw new Error('Wallet not connected!')
    if (!signMessage)
      throw new Error('Wallet does not support message signing!')
    const message = new TextEncoder().encode(DRIFT_MESSAGE)
    const signature = await signMessage(message)
    if (!sign.detached.verify(message, signature, publicKey.toBytes()))
      throw new Error('Invalid signature!')
    localStorage.setItem('lastSignature', bs58.encode(signature))
    router.push(DISCORD_GENERATED_URL)
  }

  return (
    <div className={styles.socialsContainer}>
      <div className={styles.headerText}>
        Connect your Solana wallet to get started with Drift Discord
      </div>
      <div
        className={styles.walletButtons}
        style={{
          margin: 'auto',
          width: '40%',
        }}
      >
        {!connected && <WalletMultiButton />}
        {connected && !discordUser && (
          <button
            className={styles.connectDiscordButton}
            onClick={onConnectDiscordClick}
          >
            Connect Discord
          </button>
        )}
        {connected && discordUser && (
          <UserComponent discordUsername={discordUser?.username} />
        )}
      </div>
    </div>
  )
}

const Home: NextPage = () => {
  const { connected } = useWallet()
  return (
    <div className={styles.container}>
      <Head>
        <title>Drift Socials</title>
        <meta
          name="description"
          content="Drift Socials helps you link your Solana wallet address to discord"
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
