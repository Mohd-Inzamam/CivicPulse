import { Router } from 'express'
import {
  getAllIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
  upvoteIssue,
  updateIssueStatus
} from '../controllers/issues.controller.js'
import { verifyJwt } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/multer.middleware.js'

const router = Router()

// Public routes
router.route('/').get(getAllIssues)
router.route('/:id').get(getIssueById)

// Protected routes
router.route('/').post(verifyJwt, upload.single("image"), createIssue)
router.route('/:id').put(verifyJwt, updateIssue)
router.route('/:id').delete(verifyJwt, deleteIssue)
router.route('/:id/upvote').post(verifyJwt, upvoteIssue)
router.route('/:id/status').patch(verifyJwt, updateIssueStatus)

export { router }
