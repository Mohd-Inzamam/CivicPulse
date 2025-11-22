import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

const uploadOnCloudinary = async localPath => {
  try {
    if (!localPath) return null
    const responce = await cloudinary.uploader.upload(localPath, {
      resource_type: 'auto'
    })
    fs.unlinkSync(localPath)
    return responce
  } catch (error) {
    fs.unlinkSync(localPath)
    console.log(error, 'clodinary not uploaded File!')
  }
}

export { uploadOnCloudinary }
