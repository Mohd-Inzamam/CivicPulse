import { Router } from 'express'
import { upload } from '../middleware/multer.middleware.js'
import {
  LoginUser,
  logOutUser,
  refAccessToken,
  registerUser,
  updateAccountDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  verifyEmail,
  resendVerification,
  verifyToken,
  updateAvatar
} from '../controllers/auth.controller.js'
import { verifyJwt } from '../middleware/auth.middleware.js'

const router = Router()
console.log("This is the main auth file", registerUser);

// Public routes
router.route('/register').post(upload.fields([{ name: 'avatar', maxCount: 1 }]), registerUser)
router.route('/login').post(LoginUser)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password').post(resetPassword)
router.route('/verify-reset-token').get(verifyResetToken)
router.route('/verify-email').post(verifyEmail)
router.route('/resend-verification').post(resendVerification)
router.route('/verify-token').get(verifyToken)

// Protected routes
router.route('/logout').post(verifyJwt, logOutUser)
router.route('/refresh-token').post(refAccessToken)
router.route('/update-password').patch(verifyJwt, updatePassword)
router.route('/update-account').patch(verifyJwt, updateAccountDetails)
router
  .route('/update-avatar')
  .patch(verifyJwt, upload.single("avatar"), updateAvatar);


export { router }
