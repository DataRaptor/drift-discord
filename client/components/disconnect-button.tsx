import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import { triggerToast } from '../utils'

export const DisconnectButton = () => {
  const { disconnect, connected } = useWallet()
  const router = useRouter()

  const onDisconnectClick = async () => {
    await disconnect()
    triggerToast('See you next time! Come back soon.')
    router.reload() // unfortunately we need to do this to get back the text, or else struggle with inheritance / make one componet.
  }

  return (
    <>
      {connected && (
        <div onClick={onDisconnectClick} className={styles.wrapHeadlineBounty}>
          <div className={styles.secondWrapTextHeadlineBounty}>
            <div className={styles.h4GradientBountyHeadlineDisconnect}>
              Disconnect
            </div>
          </div>
        </div>
      )}
    </>
  )
}
