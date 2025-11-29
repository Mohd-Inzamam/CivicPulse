import express from 'express'
import { registerAdmin, loginAdmin, toggleUserStatus } from '../controllers/admin.controller.js'
import { upload } from '../middleware/multer.middleware.js'
import { verifyJwt } from '../middleware/auth.middleware.js'
import { verifyAdmin } from '../middleware/role.middleware.js'

const router = express.Router()

//       ADMIN REGISTRATION
router.post(
    '/register-admin',
    upload.single('avatar'),   // admin must upload an avatar
    registerAdmin
)

//         ADMIN LOGIN
router.post('/login-admin', loginAdmin)

// ENABLE/DISABLE USER
router.patch(
    '/toggle-user/:userId',
    verifyJwt,
    verifyAdmin,
    toggleUserStatus
);

export { router };
