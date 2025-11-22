import { User } from '../models/user.model.js'
import { apiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import jwt from 'jsonwebtoken'

const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken || req.headers.authorization?.replace('Bearer ', '')
    // console.log(accessToken)

    if (!accessToken) {
      throw new apiError(400, 'Unauthorized')
    }
    const decodedToken = jwt.verify(accessToken, process.env.ACCESSTOKEN_SECRET)
    if (!decodedToken) {
      throw new apiError(400, 'Invalid token')
    }
    const user = await User.findById(decodedToken?._id).select('-PassWord') // yha password hide hai
    if (!user) {
      throw new apiError(400, 'User Not Found')
    }

    req.user = user

    next()
  } catch (error) {
    throw new apiError(400, 'authetication Failed', error)
  }
})
export { verifyJwt }
