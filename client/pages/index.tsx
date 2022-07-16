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
import { useLocalStorage } from "../hooks/localStorage"

const DISCORD_GENERATED_URL: string = "https://discord.com/api/oauth2/authorize?client_id=997668769570750524&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fv1%2Fdiscord_redirect&response_type=code&scope=identify%20email" // not a secret...

const DriftLogo = () => {
    return (
        // Note this looks a little blurry might need to adjust width...
        <a href="http://drift.trade"> 
            <img className={styles.title} src="/drift-logo.png" />
        </a>)
}

const stringToUintArray = (data: string) => Uint8Array.from(Array.from(data).map(letter => letter.charCodeAt(0))); // This method is ugly but performant

const SocialsComponent = () => {
    const router = useRouter()
    const [driftMessage, setDriftMessage] = useState("Default Drift Message") // Using the same static method is safe here...
    const { connected, publicKey, signMessage } = useWallet();

    useEffect(() => {

        // Anyway let's handle this later. Seems like some funnyness is happening...

        // if (publicKey && signature?.length > 0) {
        //     const message: Uint8Array = new TextEncoder().encode(driftMessage);
        //     const oldSignature: Uint8Array = new Uint8Array(signature)
        //     console.log("oldSignature", oldSignature)
        //     if (!sign.detached.verify(message, oldSignature, publicKey.toBytes())){
        //         setSignature(null)
        //     }
        // }
        // localStorage.setItem("hello", "SOME IMPORTANT VALUE")

        // const lastSignature: Uint8Array = stringToUintArray(localStorage.getItem("lastSignature") as string)
        // if (publicKey && lastSignature.length == 52){
        //     // We need to verify that if there's a signature in localstorage, that it checks out
        //     // with the current pubkey. else we want to clear it.
        //     const message: Uint8Array = new TextEncoder().encode(driftMessage);
        //     console.log(">>>>", lastSignature)
        //     if (!sign.detached.verify(message, lastSignature, publicKey.toBytes())){
        //         localStorage.setItem("lastSignature", "")
        //     }
        // }        
        // console.log("LOCAL", lastSignature)

    }, [connected, publicKey])

    const onConnectDiscordClick = async() => {
        try {
            if (!publicKey) throw new Error('Wallet not connected!');
            if (!signMessage) throw new Error('Wallet does not support message signing!');
            const message = new TextEncoder().encode(driftMessage);
            const signature = await signMessage(message);
            if (!sign.detached.verify(message, signature, publicKey.toBytes())) throw new Error('Invalid signature!');
            localStorage.setItem("lastSignature", signature.toString()) // how unfortunate this only accepts string...
            router.push(DISCORD_GENERATED_URL)
            alert(`Message signature: ${bs58.encode(signature)}`);
        } catch (error: any) {
            alert(`Signing failed: ${error?.message}`);
        }
    }

    return (
        <div className={styles.socialsContainer}>
        <div style={{
            margin: "auto",
            width: "300px",
            color: "white",
            textAlign: "center",
            letterSpacing: "1px",
            lineHeight: "25px",
            fontSize: "1.2em",
            marginTop: "80px",
            marginBottom: "60px"
        }}>
            Connect your Solana wallet to get started with Drift Socials.
        </div>
        <div 
            className={styles.walletButtons}
            style={{
                // margin: "auto",
                width: "26%",
                marginLeft: "275px"
            }}
            >
            { (!connected) ? <WalletMultiButton /> : <button onClick={onConnectDiscordClick}>
                Connect Discord
            </button> }
            <WalletMultiButton />
        </div>
        </div>
    )
}


const Home: NextPage = () => {
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
