import mongoose from 'mongoose'
import { MONGO_CONN_STRING } from '../config'

export const connectDB = async () => {
      await mongoose.connect(MONGO_CONN_STRING)
}
