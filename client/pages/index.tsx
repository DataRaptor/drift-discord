import { useEffect, useState } from "react"
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { sign } from 'tweetnacl';
import bs58 from 'bs58';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useRouter } from "next/router"
import { postCreateDiscordUser } from "../api"
import { toast } from "react-toastify";

const DISCORD_GENERATED_URL: string = "https://discord.com/api/oauth2/authorize?client_id=997668769570750524&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fv1%2Fdiscord_redirect&response_type=code&scope=identify%20email" // not a secret...
const DRIFT_MESSAGE: string = "Default Drift Message"

const triggerToast = (message: string) => {
    toast(message, {
        position: "bottom-right",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}

const DriftLogo = () => {
    return (
        <a href="http://drift.trade"> 
            <img className={styles.title} src="/drift-logo.png" />
        </a>)
}

const SocialsComponent = () => {
    const router = useRouter()
    const { connected, publicKey, signMessage } = useWallet();

    useEffect(() => {
        const signAndPostUserData = async() => {
            const { access_token } = router.query
            if (access_token && connected) {
                if (!publicKey) throw new Error('Wallet not connected!');
                if (!signMessage) throw new Error('Wallet does not support message signing!');
                const message = new TextEncoder().encode(DRIFT_MESSAGE);
                const signature = await signMessage(message);
                if (!sign.detached.verify(message, signature, publicKey.toBytes())) throw new Error('Invalid signature!');
                const body = {
                    publicKey: bs58.encode(publicKey.toBuffer()),
                    signature: bs58.encode(signature),
                    accessToken: access_token
                }
                const response = await postCreateDiscordUser(body)
                const responseJson = await response.json()
                console.log("DATAATA", responseJson)
                triggerToast(responseJson.message)
                router.push("/")
            }
        }
        signAndPostUserData()
    }, [connected])

    const onConnectDiscordClick = async() => {
        router.push(DISCORD_GENERATED_URL)
    }

    return (
        <div className={styles.socialsContainer}>
        <div className={styles.headerText}>
            Connect your Solana wallet to get started with Drift Socials.
        </div>
        <div 
            className={styles.walletButtons}
            style={{
                margin: "auto",
                width: "50%"                
            }}
            >
            { (!connected) ? <WalletMultiButton /> : 
            <button className={styles.connectDiscordButton} onClick={onConnectDiscordClick}>
                Connect Discord
            </button> }
        </div>
        </div>
    )
}


const Home: NextPage = () => {
    const { connected } = useWallet();
    return (
        <div className={styles.container}>
            <Head>
                <title>Drift Socials</title>
                <meta name="description" content="Drift Socials helps you link your Solana wallet address to discord" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <DriftLogo/>
                <SocialsComponent /> 
                <div style={{marginTop: "25px"}}>
                    {(connected) && <WalletMultiButton />}
                </div>
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{' '}
                    <span className={styles.logo}>
                        <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                    </span>
                </a>
            </footer>
        </div>
    );
};

export default Home;
