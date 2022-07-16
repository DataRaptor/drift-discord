import { User } from '../models'
import { logger } from '../services/logger'

export const handlePostUserController = async (
  publicKey: string,
  message: string,
  signature: string,
  discordUserData: any
): Promise<string> => {
  var message: string = ''
  const query = await User.find({
    public_key: publicKey,
    ...discordUserData,
  })
  if (query.length == 0) {
    const user: typeof User = new User({
      public_key: publicKey,
      signature: signature,
      message: message,
      ...discordUserData,
    })
    await user
      .save()
      .then(() =>
        logger.info(
          `/v1/create_discord_user A user with public key: ${publicKey} was created.`
        )
      )
    message = "Welcome! You've successfully linked your discord to Drift."
  } else {
    logger.warn(
      `/v1/create_discord_user warning, A user with ${publicKey} attempted to create a user but is already registed.`
    )
    message = 'Your discord is already registed with Drift. Welcome back!'
  }
  return message
}

export const handleGetUserController = async (
  publicKey: string
): Promise<[any, string]> => {
  const query = await User.find({
    public_key: publicKey,
  })
  // Take the last document found. We should instead add a datetime to each user model but no time left...
  const user = query[query.length - 1]
  logger.info(
    `/v1/get_discord_user successfully returned a user with public key: ${publicKey}`
  )
  const message: string = 'Welcome back!'
  return [user, message]
}
