import { Router } from 'express'
import { upload } from '../middleware/multer.middleware.js'
import {
  LoginUser,
  logOutUser,
  refAccessToken,
  registerUser,
  updateAccountDetails,
  updatePassword
} from '../controllers/auth.controller.js'
import { verifyJwt } from '../middleware/auth.middleware.js'

const router = Router()
console.log('kuchc aaya ya nhi', registerUser)

router
  .route('/registerUser')
  .post(upload.fields([{ name: 'avatar', maxCount: 1 }]), registerUser)

router.route('/loginUser').post(LoginUser)

// middlewere
router.route('/logOutUser').post(verifyJwt, logOutUser)
router.route('/refresh-token').post(refAccessToken)
router.route('/update-password').patch(verifyJwt, updatePassword)
router.route('/update-accoutDetails').patch(verifyJwt, updateAccountDetails)

export { router } // ab isko app me import kro
