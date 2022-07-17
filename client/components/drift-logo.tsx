import React from 'react'
import styles from '../styles/Home.module.css'

export const DriftLogo: React.FC = () => {
      return (
            <div style={{ zIndex: 2 }}>
                  <a href="http://drift.trade">
                        <img
                              className={styles.logoHeader}
                              src="/drift-logo.png"
                        />
                  </a>
            </div>
      )
}
