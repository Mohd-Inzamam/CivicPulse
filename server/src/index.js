import env from 'dotenv'
import { connectDb } from './db/index.js'
import { app } from './app.js'

env.config({
  path: './.env'
})

connectDb()
  .then(() => {
    app.listen(process.env.PORT || 2500, () => {
      console.log(`Server is connected at ${process.env.PORT}`)
    })
  })
  .catch(err => {
    console.log('Server is not Connected!', err)
  })
