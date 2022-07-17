import { useWallet } from '@solana/wallet-adapter-react'
import styles from '../styles/Home.module.css'

export const DisconnectButton = () => {
    const { disconnect, connected } = useWallet()
  
    const onClick = async() => {
      await disconnect()
    }
  
    return (
        <>
      { (connected) && <button onClick={onClick} className={styles.disconnectWalletButton}>Disconnect</button>}
      </>
    )
  }