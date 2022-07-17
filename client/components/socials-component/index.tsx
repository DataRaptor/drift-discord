import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { sign } from 'tweetnacl'
import bs58 from 'bs58'
import { useRouter } from 'next/router'
import useSWR from 'swr'

import { ConnectButton } from '..'
import { LoadingSpinner } from './loading-spinner'
import {
  postCreateDiscordUser,
  getDiscordUser,
  getRegistrationConfig,
} from '../../api'
import {
  fireConfetti,
  triggerToast,
  removeQueryParamsFromRouter,
} from '../../utils'
import styles from '../../styles/Home.module.css'
import { DriftDiscordLogo } from './drift-discord-logos'

const UserComponent = ({ discordUsername }: any) => {
  return (
    <>
      <DriftDiscordLogo />
      <p className={styles.usernameText}>{discordUsername}</p>
    </>
  )
}

export const SocialsComponent = () => {
  const router = useRouter()

  const [headerMessage, setHeaderMessage] = useState(
    'Connect your Solana wallet to get started with Drift Discord'
  )

  const [driftMessage, setDriftMessage] = useState('')
  const [discordGeneratedUrl, setDiscordGeneratedUrl] = useState('')

  const [discordUser, setDiscordUser] = useState(null)

  const [discordUserFetched, setDiscordUserFetched] = useState(false)
  const [registrationConfigFetched, setRegistrationConfigFetched] =
    useState(false)
  const { connected, publicKey, signMessage } = useWallet()

  const onConnectDiscordClick = async () => {
    const message = new TextEncoder().encode(driftMessage)
    const signature = await signMessage(message)
    if (!publicKey) return // break if no wallet connected.
    if (!signMessage) return // break if wallet does not support signing.
    if (!sign.detached.verify(message, signature, publicKey.toBytes())) return // break iff invalid signature
    localStorage.setItem('lastSignature', bs58.encode(signature))
    router.push(discordGeneratedUrl)
  }

  const executeGetDiscordUser = async () => {
    const publicKeyString = publicKey?.toBase58()
    const lastSignatureString = localStorage.getItem('lastSignature')
    if (!connected) return // break if wallet not connected
    if (!publicKey) return // break iff no publickey.
    if (!lastSignatureString) return // break iff wallet has not signed.
    if (discordUserFetched) return // break iff discord data has already been fetched
    const response = await getDiscordUser({
      publicKey: publicKeyString,
      signature: lastSignatureString,
    })
    const responseJson = await response.json()
    if (responseJson.ok) setDiscordUserFetched(true)
    return responseJson
  }

  const executePostUserData = async () => {
    const accessToken: string = router.query.access_token as string
    const lastSignatureString = localStorage.getItem('lastSignature')
    const lastSignature = bs58.decode(lastSignatureString)
    const message = new TextEncoder().encode(driftMessage)
    if (!connected) return // break if no wallet is connected.
    if (!publicKey) return // break iff no publickey.
    if (!accessToken) return // break if there's no encrypted access token in the route.
    if (!lastSignatureString) return // break if the user has not signed a message.
    if (!sign.detached.verify(message, lastSignature, publicKey.toBytes()))
      return // break if invalid signature
    const response = await postCreateDiscordUser({
      publicKey: bs58.encode(publicKey.toBuffer()),
      signature: bs58.encode(lastSignature),
      accessToken: accessToken,
    })
    if (response.status == 200) fireConfetti()
    const responseJson = await response.json()
    triggerToast(responseJson.message)
    removeQueryParamsFromRouter(router, ['access_token'])
  }

  const executeGetRegistrationConfig = async () => {
    const responseJson = await getRegistrationConfig()
    if (responseJson.ok) setRegistrationConfigFetched(true)
    return responseJson
  }

  const getDiscordUserResponse = useSWR(
    'GET::/v1/discord_user',
    executeGetDiscordUser,
    {
      refreshInterval: 100, // Refetch every 0.1 seconds. Note that requests will not be made if the discordUserData has already been fetched.
    }
  )

  const getRegistrationConfigResponse = useSWR(
    'GET::/v1/registration_config',
    executeGetRegistrationConfig,
    {
      refreshInterval: 30 * 1000, // Refresh every 30 seconds. We may push a new `DRIFT_MESSAGE` to the api, in these cases 30 seconds seems acceptable.
    }
  )

  useEffect(() => {
    if (getDiscordUserResponse.data?.user) {
      const username: string = getDiscordUserResponse.data.user.username
      if (!discordUser && !router.query.access_token)
        triggerToast(`Welcome back ${username}! We missed you.`)
      setDiscordUser(getDiscordUserResponse.data.user)
      setHeaderMessage('Congratulations! Your Discord account is linked to Drift')
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

  return (
    <div className={styles.socialsContainer}>
      <div className={styles.headerText}>{headerMessage}</div>
      <div
        style={{
          margin: 'auto',
          width: '40%',
          marginTop: '75px',
        }}
      >
        {!registrationConfigFetched && <LoadingSpinner />}
        {registrationConfigFetched && (
          <>
            {!connected && <ConnectButton />}
            {connected && (
              <>
                {discordUserFetched ? (
                  <>
                    {!discordUser && (
                      <button
                        className={styles.connectDiscordButton}
                        onClick={onConnectDiscordClick}
                      >
                        Connect Discord
                      </button>
                    )}
                  </>
                ) : (
                  <>{!discordUser && <LoadingSpinner />}</>
                )}
              </>
            )}
          </>
        )}
      </div>
      {connected && discordUser && (
        <UserComponent discordUsername={discordUser?.username} />
      )}
    </div>
  )
}
