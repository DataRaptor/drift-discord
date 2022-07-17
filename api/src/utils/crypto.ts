import { sign } from 'tweetnacl'
import bs58 from 'bs58'
import AesEncryption from 'aes-encryption'
import { DRIFT_MESSAGE, AES_HTTP_TRANSPORT_SECRET } from '../config'
import { logger } from '../services/logger'

const message = new TextEncoder().encode(DRIFT_MESSAGE) // Solana Encryption Message
export const verifySignature = (
      publicKey: string,
      signature: string
): boolean => {
      try {
            return sign.detached.verify(
                  message,
                  bs58.decode(signature),
                  bs58.decode(publicKey)
            )
      } catch (error) {
            logger.error(`Signature verification failed with error: ${error}`)
      }
      return false
}

const aes = new AesEncryption() // Http Transport Encryptor/ Decryptor
aes.setSecretKey(AES_HTTP_TRANSPORT_SECRET)
export const encryptAccessToken = (accessToken: string): string => aes.encrypt(accessToken)
export const decryptAccessToken = (encryptedAccessToken: string): string => aes.decrypt(encryptedAccessToken)