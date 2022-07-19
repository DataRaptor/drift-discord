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

      const DISCONNECTED_HEADER_MESSAGE: string = 'Connect your Solana wallet to get started with Drift Discord'
      const CONNECTED_HEADER_MESSAGE: string = 'Welcome. Connect your Discord to use Drift Discord'
      const LINEKD_HEADER_MESSAGE: string = 'Congratulations! Your Discord account is linked to Drift'

      const router = useRouter()
      const [headerMessage, setHeaderMessage] = useState(
            DISCONNECTED_HEADER_MESSAGE
      )
      const [driftMessage, setDriftMessage] = useState('')
      const [discordGeneratedUrl, setDiscordGeneratedUrl] = useState('')
      const [discordUser, setDiscordUser] = useState(null)
      const [discordUserFetched, setDiscordUserFetched] = useState(false)
      const [registrationConfigFetched, setRegistrationConfigFetched] =
            useState(false)
      const { connected, publicKey, signMessage } = useWallet()

      const getSignatureFromLocalStorage = (): string => {
            var lastSignature: string | null =
                  localStorage.getItem('lastSignature')
            lastSignature = lastSignature ? lastSignature : ''
            return lastSignature
      }

      const signAndPutSignatureinLocalStorage = async (): Promise<string> => {
            const message = new TextEncoder().encode(driftMessage) as Uint8Array
            if (!publicKey) throw Error('Wallet Not connected')
            const signature = await signMessage(message)
            if (sign.detached.verify(message, signature, publicKey.toBytes())) {
                  localStorage.setItem('lastSignature', bs58.encode(signature))
            }
            return bs58.encode(signature)
      }

      useEffect(() => {
            // Whenever the user connects, Check localstorage for the last signature they've signed.
            // If it DNE, signAndStoreSignature in localstorage.
            // If it Exists but does not match the current publickey signAndStoreSignature again.
            // set the `lastSignature` useState variable to the last known signature.

            // This will ensure valid signatures make it to the API and minimize the number of times
            // users have to sign messages.
            if (!registrationConfigFetched) return // break if we have not fetched registration yet
            const message = new TextEncoder().encode(driftMessage) as Uint8Array
            const executeRefetchSignature = async () => {
                  setDiscordUser(null)
                  setDiscordUserFetched(false)
                  // setHeaderMessage(DISCONNECTED_HEADER_MESSAGE)
                  if (connected && publicKey) {
                        var lastSignature = getSignatureFromLocalStorage()
                        if (!lastSignature) {
                              lastSignature =
                                    await signAndPutSignatureinLocalStorage()
                        }
                        if (
                              !sign.detached.verify(
                                    message,
                                    bs58.decode(lastSignature),
                                    publicKey.toBytes()
                              )
                        ) {
                              await signAndPutSignatureinLocalStorage()
                        }
                  }
            }
            executeRefetchSignature()
      }, [connected, publicKey, driftMessage])

      const onConnectDiscordClick = async () => {
            const message = new TextEncoder().encode(driftMessage) as Uint8Array
            const lastSignature = getSignatureFromLocalStorage()
            if (!connected) return // break if wallet not connected.
            if (!publicKey) return // break iff no publickey.
            if (
                  !lastSignature ||
                  !sign.detached.verify(
                        message,
                        bs58.decode(lastSignature),
                        publicKey.toBytes()
                  )
            ) {
                  // If the user attempts to click the discord button before they sign the message.
                  triggerToast(
                        'You must sign the drift message with your wallet before connecting discord!'
                  )
                  signAndPutSignatureinLocalStorage()
                  return // break iff wallet has not signed.
            }
            router.push(discordGeneratedUrl)
      }

      const executeGetDiscordUser = async () => {
            const publicKeyString = publicKey?.toBase58()
                  ? (publicKey?.toBase58() as string)
                  : ''
            const lastSignatureString = getSignatureFromLocalStorage()
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

      const executePostDiscordUser = async () => {
            const accessToken: string | string[] | undefined =
                  router.query.access_token
            if (!accessToken) return // break immediated if theres is no access token in query params
            const lastSignature = getSignatureFromLocalStorage()
            if (!connected) return // break if wallet not connected
            if (!publicKey) return // break iff no publickey.
            if (!lastSignature) return // break if no signature
            const response = await postCreateDiscordUser({
                  publicKey: bs58.encode(publicKey.toBuffer()),
                  signature: lastSignature,
                  accessToken: accessToken as string,
            })
            if (response.status == 200) {
                  const responseJson = await response.json()
                  triggerToast(responseJson.message)
            }
            removeQueryParamsFromRouter(router, ['access_token'])
      }

      useEffect(() => {
            // This hook is used for detecting accessTokens in the url 
            // and posts to the API if it exists. 
            const executeOnRouterChange = async () => {
                  await executePostDiscordUser()
            }
            executeOnRouterChange()
      }, [router.query.access_token, connected])

      useEffect(() => {
            if (!connected) setHeaderMessage(DISCONNECTED_HEADER_MESSAGE)
            if (connected && !discordUser) setHeaderMessage(CONNECTED_HEADER_MESSAGE)
      }, [connected])

      const executeGetRegistrationConfig = async () => {
            if (registrationConfigFetched) return
            const responseJson = await getRegistrationConfig()
            if (responseJson.ok) setRegistrationConfigFetched(true)
            return responseJson
      }

      const getDiscordUserResponse = useSWR(
            'GET::/v1/discord_user',
            executeGetDiscordUser,
            {
                  refreshInterval: 100, // Execute every 0.1 seconds. Note that requests will not be made if the discordUserData has already been fetched.
            }
      )

      const getRegistrationConfigResponse = useSWR(
            'GET::/v1/registration_config',
            executeGetRegistrationConfig,
            {
                  refreshInterval: 100, // Execute every 0.1 seconds. Note requests will not execute if already fetched. 
            }
      )

      useEffect(() => {
            if (getDiscordUserResponse.data?.user) {
                  // I would like this but need to put a better place to put it.
                  // const username: string = getDiscordUserResponse.data.user.username
                  // if (!discordUser && !router.query.access_token)
                  //   triggerToast(`Welcome back ${username}! We missed you.`)
                  setDiscordUser(getDiscordUserResponse.data.user)
                  setHeaderMessage(LINEKD_HEADER_MESSAGE)
                  fireConfetti()
            }
      }, [getDiscordUserResponse.data])

      useEffect(() => {
            if (getRegistrationConfigResponse.data) {
                  const { registrationConfig } =
                        getRegistrationConfigResponse.data
                  setDriftMessage(registrationConfig.driftMessage)
                  setDiscordGeneratedUrl(registrationConfig.discordGeneratedUrl)
            }
      }, [getRegistrationConfigResponse.data])

      return (
            <div className={styles.socialsContainerWrapper}>
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
                                                                        className={
                                                                              styles.connectDiscordButton
                                                                        }
                                                                        onClick={
                                                                              onConnectDiscordClick
                                                                        }
                                                                  >
                                                                        Connect
                                                                        Discord
                                                                  </button>
                                                            )}
                                                      </>
                                                ) : (
                                                      <>
                                                            {!discordUser && (
                                                                  <LoadingSpinner />
                                                            )}
                                                      </>
                                                )}
                                          </>
                                    )}
                              </>
                        )}
                  </div>
                  {connected && discordUser && (
                        <UserComponent
                              discordUsername={discordUser?.username}
                        />
                  )}
            </div>
            </div>
      )
}
