import {
      createDefaultAuthorizationResultCache,
      SolanaMobileWalletAdapter,
} from '@solana-mobile/wallet-adapter-mobile'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
      ConnectionProvider,
      WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
      GlowWalletAdapter,
      PhantomWalletAdapter,
      SlopeWalletAdapter,
      SolflareWalletAdapter,
      TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import { AppProps } from 'next/app'
import { FC, useMemo } from 'react'
import Document, { Head } from 'next/document'
import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import '@solana/wallet-adapter-react-ui/styles.css'
import '../styles/globals.css'

const App: FC<AppProps> = ({ Component, pageProps }) => {
      const network = WalletAdapterNetwork.Devnet
      const endpoint = useMemo(() => clusterApiUrl(network), [network])
      const wallets = useMemo(
            () => [
                  new SolanaMobileWalletAdapter({
                        appIdentity: { name: 'Solana Next.js Starter App' },
                        authorizationResultCache:
                              createDefaultAuthorizationResultCache(),
                  }),
                  new PhantomWalletAdapter(),
                  new GlowWalletAdapter(),
                  new SlopeWalletAdapter(),
                  new SolflareWalletAdapter({ network }),
                  new TorusWalletAdapter(),
            ],
            [network]
      )

      return (
            <ConnectionProvider endpoint={endpoint}>
                  <WalletProvider wallets={wallets} autoConnect>
                        <WalletModalProvider>
                              <Component {...pageProps} />
                        </WalletModalProvider>
                  </WalletProvider>
                  <ToastContainer />
            </ConnectionProvider>
      )
}

export default App
