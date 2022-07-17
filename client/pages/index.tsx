import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import {
      DriftLogo,
      SocialsComponent,
      GradientBackground,
      DisconnectButton,
} from '../components'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
      return (
            <>
                  <GradientBackground />
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
                              <DisconnectButton />
                        </main>

                        <footer className={styles.footer}>
                              <a
                                    href="http://drift.trade"
                                    target="_blank"
                                    rel="noopener noreferrer"
                              >
                                    <span className={styles.logo}>
                                          <Image
                                                src="/drift-logo.png"
                                                alt="Drift Logo"
                                                width={74}
                                                height={25}
                                          />
                                    </span>
                              </a>
                        </footer>
                  </div>
            </>
      )
}

export default Home
