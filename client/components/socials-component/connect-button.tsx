import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import styles from '../../styles/Home.module.css'

export const ConnectButton = () => {
  const { connected } = useWallet()

  const { visible, setVisible } = useWalletModal()
  const onClick = React.useCallback(
    (event: React.MouseEvent<any>) => {
      if (!event.defaultPrevented) setVisible(!visible)
    },
    [visible]
  )

  return (
    <>
      {!connected && (
        <div className={styles.connectButtonWrapper}>
          <div onClick={onClick} className={styles.wrapHeadlineBounty}>
            <div className={styles.secondWrapTextHeadlineBounty}>
              <div className={styles.h4GradientBountyHeadlineConnect}>
                Connect Wallet
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
