import { Router } from 'express'
import {
  getAllIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
  upvoteIssue,
  updateIssueStatus,
  addComment,
  deleteComment,
  watchIssue
} from '../controllers/issues.controller.js'
import { verifyJwt } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/multer.middleware.js'
import { verifyAdmin } from '../middleware/role.middleware.js'

const router = Router()

// Public
router.route('/').get(getAllIssues)
router.route('/:id').get(getIssueById)

// Protected
router.route('/').post(verifyJwt, upload.single('image'), createIssue)
router.route('/:id').put(verifyJwt, updateIssue)
router.route('/:id').delete(verifyJwt, deleteIssue)
router.route('/:id/upvote').post(verifyJwt, upvoteIssue)
router.route('/:id/status').patch(verifyJwt, verifyAdmin, updateIssueStatus)
router.route('/:id/watch').post(verifyJwt, watchIssue)
router.route('/:id/comments').post(verifyJwt, addComment)
router.route('/:id/comments/:commentId').delete(verifyJwt, deleteComment)

export { router }