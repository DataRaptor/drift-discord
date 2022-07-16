const mongoose = require('mongoose')
import { MONGO_CONN_STRING } from '../config'

const connectDB = async () => {
  await mongoose.connect(MONGO_CONN_STRING)
}
