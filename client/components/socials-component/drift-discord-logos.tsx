import React from 'react'
import styles from '../../styles/Home.module.css'

export const DriftDiscordLogo: React.FC = () => {
      return (
            <div
                  style={{
                        zIndex: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginLeft: '90px',
                        marginRight: '90px',
                        marginTop: '-25px',
                        // marginBottom: '30px',
                  }}
            >
                  <a href="http://drift.trade">
                        <img
                              className={styles.logoLinkGlow}
                              src="/drift-logo-circular.png"
                              width="90px"
                        />
                  </a>
                  <div>
                        <p
                              style={{
                                    color: 'white',
                                    marginTop: '30px',
                                    fontSize: '1.5em',
                              }}
                        >
                              +
                        </p>
                  </div>
                  <a href="https://discord.com/invite/fMcZBH8ErM">
                        <img
                              className={styles.logoLinkGlow}
                              src="/discord-logo.png"
                              width="85px"
                              height="auto"
                        />
                  </a>
            </div>
      )
}
