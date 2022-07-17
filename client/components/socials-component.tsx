import { useEffect, useState } from 'react'
import { ConnectButton } from './connect-button'
import { useWallet } from '@solana/wallet-adapter-react'
import { sign } from 'tweetnacl'
import bs58 from 'bs58'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { postCreateDiscordUser, getDiscordUser, getRegistrationConfig } from '../api'
import { fireConfetti, triggerToast } from '../utils'
import styles from '../styles/Home.module.css'


const UserComponent = ({ discordUsername }: any) => {
    return (
      <div className={styles.userContainer}>
        <h1 className={styles.usernameText}>Discord: {discordUsername}</h1>
      </div>
    )
}



export const SocialsComponent = () => {
    const router = useRouter()
    const [ driftMessage, setDriftMessage ] = useState("")
    const [ headerMessage, setHeaderMessage ] = useState("Connect your Solana wallet to get started with Drift Discord")
    const [ discordGeneratedUrl, setDiscordGeneratedUrl ] = useState("")
    const [ discordUser, setDiscordUser ] = useState(null)
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
      const accessToken: string = router.query.access_token as string
      const lastSignatureString = localStorage.getItem('lastSignature')
      if (accessToken && connected && lastSignatureString) {
        if (!publicKey) throw new Error('Wallet not connected!')
        const lastSignature = bs58.decode(lastSignatureString)
        const message = new TextEncoder().encode(driftMessage)
        if (!sign.detached.verify(message, lastSignature, publicKey.toBytes()))
          throw new Error('Invalid signature!')
        const response = await postCreateDiscordUser({
          publicKey: bs58.encode(publicKey.toBuffer()),
          signature: bs58.encode(lastSignature),
          accessToken: accessToken,
        })
        if (response.status == 200) fireConfetti()
        const responseJson = await response.json()
        triggerToast(responseJson.message)
        router.push('/')
      }
    }
  
    const getDiscordUserResponse = useSWR(
      'GET::/v1/discord_user',
      executeGetDiscordUser,
      {
        refreshInterval: 500, // Refetch every 0.5 seconds.
      }
    )

    const getRegistrationConfigResponse = useSWR(
      'GET::/v1/registration_config',
      getRegistrationConfig,
      {
        refreshInterval: 30 * 1000 // Refresh every 30 seconds.
      }
    )
  
    useEffect(() => {
      if (getDiscordUserResponse.data?.user) {
        const username: string = getDiscordUserResponse.data.user.username;
        if (!discordUser && !router.query.access_token) triggerToast(`Welcome back ${username}! We missed you.`)
        setDiscordUser(getDiscordUserResponse.data.user)
        setHeaderMessage("Welcome to Drift Discord")
      }
    }, [getDiscordUserResponse.data])
  
    useEffect(() => {
      if (getRegistrationConfigResponse.data) {
        const { registrationConfig } = getRegistrationConfigResponse.data
        setDriftMessage(registrationConfig.driftMessage)
        setDiscordGeneratedUrl(registrationConfig.discordGeneratedUrl)
      }
    }, [getRegistrationConfigResponse.data])

    useEffect(() => {
      if (connected) executePostUserData()
    }, [connected])
  
    const onConnectDiscordClick = async () => {
      if (!publicKey) throw new Error('Wallet not connected!')
      if (!signMessage)
        throw new Error('Wallet does not support message signing!')
      const message = new TextEncoder().encode(driftMessage)
      const signature = await signMessage(message)
      if (!sign.detached.verify(message, signature, publicKey.toBytes()))
        throw new Error('Invalid signature!')
      localStorage.setItem('lastSignature', bs58.encode(signature))
      router.push(discordGeneratedUrl)
    }
  
    console.log("DCORD USER", discordUser)

    return (
      <div className={styles.socialsContainer}>
        <div className={styles.headerText}>
          {headerMessage}
        </div>

        <div
          className={styles.walletButtons}
          style={{
            margin: 'auto',
            width: '40%',
          }}
        >
          {!connected && <ConnectButton/>}
          {(connected && !discordUser) && 
            <button
              className={styles.connectDiscordButton}
              onClick={onConnectDiscordClick}
            >
              Connect Discord
            </button>
          }
          {connected && discordUser && (
            <UserComponent discordUsername={discordUser?.username as string} />
          )}
        </div>
      </div>
    )
  }