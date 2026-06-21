import { asyncHandler } from '../utils/asyncHandler.js'
import { apiError } from '../utils/apiError.js'
import { apiResponce } from '../utils/apiResponce.js'
import { Issue } from '../models/issue.model.js'
import {
    suggestCategoryAndPriority,
    detectDuplicates,
    generateCivicInsight,
    suggestAdminResponse,
    scoreReportQuality
} from '../utils/Aiutils.js'

// ─── 1. Category + priority suggestion ──────────────────────────────────────
// Called on description blur in ReportIssue form
// Protected — logged-in users only
export const suggestIssueCategory = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    if (!description || description.trim().length < 15) {
        throw new apiError(400, 'Description must be at least 15 characters for AI suggestion')
    }

    const suggestion = await suggestCategoryAndPriority({
        title: title?.trim() || '',
        description: description.trim()
    })

    return res.status(200).json(
        new apiResponce(200, suggestion, 'AI suggestion generated')
    )
})

// ─── 2. Duplicate detection ──────────────────────────────────────────────────
// Called just before form submission in ReportIssue
// Protected — logged-in users only
export const checkDuplicates = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body

    if (!title?.trim() || !description?.trim()) {
        throw new apiError(400, 'Title and description are required')
    }

    // Fetch recent open issues in the same category (or all if no category yet)
    const filter = { status: { $in: ['Open', 'In Progress'] } }
    if (category) filter.category = category

    const existingIssues = await Issue.find(filter)
        .select('_id title category status location')
        .sort({ createdAt: -1 })
        .limit(15)

    const result = await detectDuplicates({
        title: title.trim(),
        description: description.trim(),
        existingIssues
    })

    return res.status(200).json(
        new apiResponce(200, result, 'Duplicate check complete')
    )
})

// ─── 3. Admin civic insight ──────────────────────────────────────────────────
// Called on admin dashboard load — admin only
export const getCivicInsight = asyncHandler(async (req, res) => {
    // Gather live stats
    const [total, open, inProgress, resolved, closed, categoryAgg] = await Promise.all([
        Issue.countDocuments(),
        Issue.countDocuments({ status: 'Open' }),
        Issue.countDocuments({ status: 'In Progress' }),
        Issue.countDocuments({ status: 'Resolved' }),
        Issue.countDocuments({ status: 'Closed' }),
        Issue.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }])
    ])

    const categoryBreakdown = categoryAgg.reduce((acc, c) => {
        acc[c._id] = c.count
        return acc
    }, {})

    // Rough avg resolution time from statusHistory
    const resolvedIssues = await Issue.find({ status: { $in: ['Resolved', 'Closed'] } })
        .select('createdAt statusHistory')
        .limit(50)

    let avgResolutionDays = null
    if (resolvedIssues.length > 0) {
        const days = resolvedIssues
            .map(issue => {
                const resolvedEntry = issue.statusHistory?.find(
                    h => h.status === 'Resolved' || h.status === 'Closed'
                )
                if (!resolvedEntry) return null
                return (new Date(resolvedEntry.changedAt) - new Date(issue.createdAt)) / (1000 * 60 * 60 * 24)
            })
            .filter(d => d !== null && d >= 0)

        if (days.length > 0) {
            avgResolutionDays = Math.round(days.reduce((a, b) => a + b, 0) / days.length)
        }
    }

    const insight = await generateCivicInsight({
        total, open, inProgress, resolved, closed,
        categoryBreakdown,
        avgResolutionDays
    })

    return res.status(200).json(
        new apiResponce(200, { insight }, 'Civic insight generated')
    )
})

// ─── 4. Admin response suggestion ───────────────────────────────────────────

export const getAdminResponseSuggestion = asyncHandler(async (req, res) => {
    const { issueId, newStatus } = req.body

    if (!issueId || !newStatus) {
        throw new apiError(400, 'issueId and newStatus are required')
    }

    const issue = await Issue.findById(issueId).select('title category location')
    if (!issue) throw new apiError(404, 'Issue not found')

    const suggestion = await suggestAdminResponse({
        issueTitle: issue.title,
        issueCategory: issue.category,
        issueLocation: issue.location,
        newStatus
    })

    return res.status(200).json(
        new apiResponce(200, { suggestion }, 'Response suggestion generated')
    )
})
// ─── 5. Report quality scorer ────────────────────────────────────────────────
// Called while user types description in ReportIssue form — debounced client-side
// Protected — logged-in users only
export const getReportQualityScore = asyncHandler(async (req, res) => {
    const { title, description, location } = req.body

    if (!description || description.trim().length < 20) {
        return res.status(200).json(
            new apiResponce(200, { score: null, tip: null }, 'Description too short to score')
        )
    }

    const result = await scoreReportQuality({
        title: title?.trim() || '',
        description: description.trim(),
        location: location?.trim() || ''
    })

    return res.status(200).json(
        new apiResponce(200, result, 'Report quality scored')
    )
})