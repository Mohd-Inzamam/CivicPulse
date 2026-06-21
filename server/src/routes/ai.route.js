import { Router } from 'express'
import { verifyJwt } from '../middleware/auth.middleware.js'
import { verifyAdmin } from '../middleware/role.middleware.js'
import {
    suggestIssueCategory,
    checkDuplicates,
    getCivicInsight,
    getAdminResponseSuggestion,
    getReportQualityScore
} from '../controllers/ai.controller.js'

const router = Router()

// User routes — logged-in citizens
router.post('/suggest-category', verifyJwt, suggestIssueCategory)
router.post('/check-duplicates', verifyJwt, checkDuplicates)
router.post('/report-quality', verifyJwt, getReportQualityScore)

// Admin only
router.get('/civic-insight', verifyJwt, verifyAdmin, getCivicInsight)
router.post('/suggest-response', verifyJwt, verifyAdmin, getAdminResponseSuggestion)

export { router }