import mongoose from 'mongoose'
import { Db_Name } from '../constant.js'

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${Db_Name}`
    )
    console.log(
      `MongoDb SuccessFully Connect ${connectionInstance.connection.host}${Db_Name}`
    )
  } catch (error) {
    console.log('Error MongoDb Connection Error', error);
    process.exit(1)
  }
}
export { connectDb }
