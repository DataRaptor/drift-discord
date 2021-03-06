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
      getAuthConfig,
} from '../../api'
import {
      fireConfetti,
      triggerToast,
      removeQueryParamsFromRouter,
} from '../../utils'
import styles from '../../styles/Home.module.css'
import { DriftDiscordLogo } from './drift-discord-logos'

export const SocialsComponent = () => {
      const DISCONNECTED_HEADER_MESSAGE: string =
            'Connect your Solana wallet to get started with Drift Discord'
      const CONNECTED_HEADER_MESSAGE: string =
            'Welcome. Connect your Discord to use Drift Discord'
      const LINEKD_HEADER_MESSAGE: string =
            'Congratulations! Your Discord account is linked to Drift'

      const router = useRouter()
      const [headerMessage, setHeaderMessage] = useState(
            DISCONNECTED_HEADER_MESSAGE
      )
      const [driftMessage, setDriftMessage] = useState('')
      const [discordGeneratedUrl, setDiscordGeneratedUrl] = useState('')
      const [discordUser, setDiscordUser] = useState(null)
      const [discordUserFetched, setDiscordUserFetched] = useState(false)
      const [authConfigFetched, setAuthConfigFetched] =
            useState(false)
      const { connected, publicKey, signMessage } = useWallet()

      const getSignatureFromLocalStorage = (): string => {
            // Get the last signature signed by a wallet from localstorage.
            var lastSignature: string | null =
                  localStorage.getItem('lastSignature')
            lastSignature = lastSignature ? lastSignature : ''
            return lastSignature
      }

      const signAndPutSignatureinLocalStorage = async (): Promise<string> => {
            // Sign message with Solana wallet and put the resulting signature in
            // local storage.
            const message = new TextEncoder().encode(driftMessage) as Uint8Array
            if (!publicKey) throw Error('Wallet Not connected')
            const signature = await signMessage(message)
            if (sign.detached.verify(message, signature, publicKey.toBytes())) {
                  localStorage.setItem('lastSignature', bs58.encode(signature))
            }
            return bs58.encode(signature)
      }

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
                  return // break since wallet has not signed. The user must then reclick the discord button.
            }
            router.push(discordGeneratedUrl)
      }

      const executeGetAuthConfig = async () => {
            // Executed on page load, this gets us our message to sign and the discord
            // oAuth redirect from the server so that we don't have to store in on the client.
            if (authConfigFetched) return
            const responseJson = await getAuthConfig()
            if (responseJson.ok) setAuthConfigFetched(true)
            return responseJson
      }

      const executeGetDiscordUser = async () => {
            const publicKeyString = publicKey?.toBase58()
                  ? (publicKey?.toBase58() as string)
                  : ''
            const lastSignatureString = getSignatureFromLocalStorage()
            if (!connected) return // break iff wallet not connected
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
            if (!accessToken) return // break iff theres is no access token in query params
            if (!connected) return // break iff wallet not connected
            if (!publicKey) return // break iff no publickey.
            const lastSignature = getSignatureFromLocalStorage()
            if (!lastSignature) return // break if no signature
            const response = await postCreateDiscordUser({
                  publicKey: bs58.encode(publicKey.toBuffer()),
                  signature: lastSignature,
                  accessToken: accessToken as string,
            })
            if (response.status == 200) {
                  const responseJson = await response.json()
                  triggerToast(responseJson.message)
                  removeQueryParamsFromRouter(router, ['access_token']) // remove token from url on success
            }
      }

      const getDiscordUserResponse = useSWR(
            'GET::/v1/discord_user',
            executeGetDiscordUser,
            {
                  refreshInterval: 100, // Execute every 0.1 seconds. Note that requests will not be made if the discordUserData has already been fetched.
            }
      )

      const getAuthConfigResponse = useSWR(
            'GET::/v1/auth_config',
            executeGetAuthConfig,
            {
                  refreshInterval: 100, // Execute every 0.1 seconds. Note requests will not execute if authConfig already fetched.
            }
      )

      useEffect(() => {
            // Whenever the user connects, Check localstorage for the last signature they've signed.
            // If it DNE, signAndStoreSignature in localstorage.
            // If it Exists but does not match the current publickey signAndStoreSignature again.
            // set the `lastSignature` useState variable to the last known signature.

            // This will ensure valid signatures make it to the API and minimize the number of times
            // users have to sign messages.
            if (!authConfigFetched) return // break if we have not fetched registration yet
            const message = new TextEncoder().encode(driftMessage) as Uint8Array
            const executeRefetchSignature = async () => {
                  setDiscordUser(null)
                  setDiscordUserFetched(false)
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
            if (connected && !discordUser)
                  setHeaderMessage(CONNECTED_HEADER_MESSAGE)
      }, [connected])

      useEffect(() => {
            if (getDiscordUserResponse.data?.user) {
                  setDiscordUser(getDiscordUserResponse.data.user)
                  setHeaderMessage(LINEKD_HEADER_MESSAGE)
                  fireConfetti()
            }
      }, [getDiscordUserResponse.data])

      useEffect(() => {
            if (getAuthConfigResponse.data) {
                  const { authConfig } =
                        getAuthConfigResponse.data
                  setDriftMessage(authConfig.driftMessage)
                  setDiscordGeneratedUrl(authConfig.discordGeneratedUrl)
            }
      }, [getAuthConfigResponse.data])

      return (
            <div className={styles.socialsContainerWrapper}>
                  <div className={styles.socialsContainer}>
                        <div className={styles.headerText}>{headerMessage}</div>
                        <div className={styles.socialsContainerInner}>
                              {!authConfigFetched && <LoadingSpinner />}
                              {authConfigFetched && (
                                    <>
                                          {!connected && <ConnectButton />}
                                          {connected && !discordUser && (
                                                <>
                                                      {discordUserFetched ? (
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
                                                      ) : (
                                                            <LoadingSpinner />
                                                      )}
                                                </>
                                          )}
                                    </>
                              )}
                        </div>
                        {connected && discordUser && (
                              <>
                                    <DriftDiscordLogo />
                                    <p className={styles.usernameText}>
                                          {discordUser?.username}
                                    </p>
                              </>
                        )}
                  </div>
            </div>
      )
}
