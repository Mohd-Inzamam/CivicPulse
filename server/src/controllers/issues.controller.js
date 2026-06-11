import { apiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { apiResponce } from '../utils/apiResponce.js'
import { Issue } from '../models/issue.model.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { transporter } from '../utils/email/mailTransporter.js'
import { statusUpdateTemplate, watcherStatusUpdateTemplate } from '../utils/email/EmailTemplates.js'

// ─── helpers ────────────────────────────────────────────────────────────────

const populatedIssueQuery = (query) =>
  query
    .populate('createdBy', 'fullName email')
    .populate('comments.user', 'fullName email')
    .populate('statusHistory.changedBy', 'fullName email')
    .populate('watchers', 'fullName email')

const APP_URL = process.env.APP_URL || 'http://localhost:5173'

async function sendStatusEmail(issue, oldStatus, newStatus) {
  try {
    // Notify the reporter
    if (issue.createdBy?.email) {
      await transporter.sendMail({
        from: `"CivicPulse" <${process.env.SMTP_USER}>`,
        to: issue.createdBy.email,
        subject: `Your issue status changed: ${oldStatus} → ${newStatus}`,
        html: statusUpdateTemplate(
          issue.createdBy.fullName || 'Citizen',
          issue.title,
          oldStatus,
          newStatus,
          issue._id.toString(),
          APP_URL
        )
      })
    }

    // Notify watchers (skip reporter — already notified above)
    const reporterId = issue.createdBy?._id?.toString()
    const watcherEmails = (issue.watchers || [])
      .filter(w => w._id?.toString() !== reporterId && w.email)

    await Promise.all(
      watcherEmails.map(w =>
        transporter.sendMail({
          from: `"CivicPulse" <${process.env.SMTP_USER}>`,
          to: w.email,
          subject: `Issue update: ${issue.title}`,
          html: watcherStatusUpdateTemplate(
            w.fullName || 'Citizen',
            issue.title,
            newStatus,
            issue._id.toString(),
            APP_URL
          )
        })
      )
    )
  } catch (err) {
    // Log but never crash the request on email failure
    console.error('Email send error:', err.message)
  }
}

// ─── controllers ────────────────────────────────────────────────────────────

const getAllIssues = asyncHandler(async (req, res) => {
  try {
    const { search, category, status, location, page = 1, limit = 10, createdBy } = req.query

    const filter = {}

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    if (category) filter.category = category
    if (status) filter.status = status
    if (location) filter.location = { $regex: location, $options: 'i' }

    if (createdBy === 'me' && req.user?._id) {
      filter.createdBy = req.user._id
    } else if (createdBy && createdBy !== 'me') {
      filter.createdBy = createdBy
    }

    const skip = (page - 1) * limit

    const issues = await populatedIssueQuery(
      Issue.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit))
    )

    const total = await Issue.countDocuments(filter)

    return res.status(200).json(new apiResponce(200, {
      issues,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    }, 'Issues retrieved successfully'))
  } catch (error) {
    console.log('Error Getting all Issues', error)
    throw new apiError(500, 'Failed to get issues')
  }
})

const getIssueById = asyncHandler(async (req, res) => {
  try {
    const issue = await populatedIssueQuery(Issue.findById(req.params.id))
    if (!issue) throw new apiError(404, 'Issue not found')
    return res.status(200).json(new apiResponce(200, issue, 'Issue retrieved successfully'))
  } catch (error) {
    console.log('Error Getting Issue by ID', error)
    throw error
  }
})

const createIssue = asyncHandler(async (req, res) => {
  try {
    const { title, description, category, location, priority, tags } = req.body

    if (!(title && description && category && location)) {
      throw new apiError(400, 'All required fields must be provided')
    }

    let imageUrl = null
    if (req.file?.path) {
      const uploaded = await uploadOnCloudinary(req.file.path)
      imageUrl = uploaded?.secure_url || null
    }

    const issue = await Issue.create({
      title,
      description,
      category,
      location,
      priority: priority || 'Medium',
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      image: imageUrl,
      createdBy: req.user._id,
      status: 'Open',
      upvotes: 0,
      // Seed initial status history entry
      statusHistory: [{ status: 'Open', changedAt: new Date(), changedBy: req.user._id }]
    })

    const populated = await populatedIssueQuery(Issue.findById(issue._id))
    return res.status(201).json(new apiResponce(201, populated, 'Issue created successfully'))
  } catch (error) {
    console.log('Error reporting issue', error)
    throw error
  }
})

const updateIssue = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, category, location, image } = req.body

    const issue = await Issue.findById(id)
    if (!issue) throw new apiError(404, 'Issue not found')

    if (issue.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new apiError(403, 'Not authorized to update this issue')
    }

    const updateData = {}
    if (title) updateData.title = title
    if (description) updateData.description = description
    if (category) updateData.category = category
    if (location) updateData.location = location
    if (image) updateData.image = image

    const updated = await populatedIssueQuery(
      Issue.findByIdAndUpdate(id, updateData, { new: true })
    )
    return res.status(200).json(new apiResponce(200, updated, 'Issue updated successfully'))
  } catch (error) {
    console.log('Error Updating Issue', error)
    throw error
  }
})

const deleteIssue = asyncHandler(async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
    if (!issue) throw new apiError(404, 'Issue not found')

    const isOwner = issue.createdBy.toString() === req.user._id.toString()
    const isAdmin = req.user.role === 'admin'

    if (!isOwner && !isAdmin) throw new apiError(403, 'Not authorized to delete this issue')

    if (!isAdmin) {
      if (issue.status !== 'Open') throw new apiError(400, 'Cannot delete issue already in progress')
      if (issue.upvotes > 0) throw new apiError(400, 'Cannot delete issue with public engagement')
    }

    await Issue.findByIdAndDelete(req.params.id)
    return res.status(200).json(new apiResponce(200, {}, 'Issue deleted successfully'))
  } catch (error) {
    console.log('Error Deleting Issue', error)
    throw error
  }
})

const upvoteIssue = asyncHandler(async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
    if (!issue) throw new apiError(404, 'Issue not found')
    if (req.user.role === 'admin') throw new apiError(403, 'Admins cannot upvote issues')

    const alreadyUpvoted = issue.upvotedBy.some(uid => uid.toString() === req.user._id.toString())
    if (alreadyUpvoted) throw new apiError(400, 'You have already upvoted this issue')

    issue.upvotes += 1
    issue.upvotedBy.push(req.user._id)
    await issue.save()

    return res.status(200).json(new apiResponce(200, {
      upvotes: issue.upvotes,
      upvotedBy: issue.upvotedBy
    }, 'Issue upvoted successfully'))
  } catch (error) {
    console.log('Error upvoting the issue', error)
    throw error
  }
})

// ─── updateIssueStatus — core civic feature ──────────────────────────────────
// Records history + sends email to reporter and watchers
const updateIssueStatus = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params
    const { status, note } = req.body

    if (!status) throw new apiError(400, 'Status is required')

    const validStatuses = ['Open', 'In Progress', 'Resolved', 'Closed']
    if (!validStatuses.includes(status)) throw new apiError(400, 'Invalid status')

    if (req.user.role !== 'admin') throw new apiError(403, 'Only admins can update issue status')

    const issue = await populatedIssueQuery(Issue.findById(id))
    if (!issue) throw new apiError(404, 'Issue not found')

    const oldStatus = issue.status

    // Push to statusHistory before saving new status
    issue.statusHistory.push({
      status,
      changedAt: new Date(),
      changedBy: req.user._id,
      note: note?.trim() || ''
    })

    issue.status = status
    await issue.save()

    // Re-populate after save so statusHistory.changedBy is populated
    const updatedIssue = await populatedIssueQuery(Issue.findById(id))

    // Send notifications in background — don't await so response is instant
    sendStatusEmail(updatedIssue, oldStatus, status)

    return res.status(200).json(new apiResponce(200, updatedIssue, 'Issue status updated successfully'))
  } catch (error) {
    console.log('Error updating status', error)
    throw error
  }
})

// ─── comments ──────────────────────────────────────────────────────────────
const addComment = asyncHandler(async (req, res) => {
  try {
    const { text } = req.body
    if (!text?.trim()) throw new apiError(400, 'Comment text is required')

    const issue = await Issue.findById(req.params.id)
    if (!issue) throw new apiError(404, 'Issue not found')

    issue.comments.push({ user: req.user._id, text: text.trim(), createdAt: new Date() })
    await issue.save()

    const updated = await populatedIssueQuery(Issue.findById(req.params.id))
    return res.status(201).json(new apiResponce(201, updated, 'Comment added successfully'))
  } catch (error) {
    console.log('Error adding comment', error)
    throw error
  }
})

const deleteComment = asyncHandler(async (req, res) => {
  try {
    const { id, commentId } = req.params
    const issue = await Issue.findById(id)
    if (!issue) throw new apiError(404, 'Issue not found')

    const comment = issue.comments.id(commentId)
    if (!comment) throw new apiError(404, 'Comment not found')

    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new apiError(403, 'Not authorized to delete this comment')
    }

    issue.comments.pull(commentId)
    await issue.save()

    const updated = await populatedIssueQuery(Issue.findById(id))
    return res.status(200).json(new apiResponce(200, updated, 'Comment deleted successfully'))
  } catch (error) {
    console.log('Error deleting comment', error)
    throw error
  }
})

// ─── watch / unwatch ─────────────────────────────────────────────────────────
const watchIssue = asyncHandler(async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
    if (!issue) throw new apiError(404, 'Issue not found')

    const userId = req.user._id
    const isWatching = issue.watchers.some(w => w.toString() === userId.toString())

    if (isWatching) {
      issue.watchers = issue.watchers.filter(w => w.toString() !== userId.toString())
    } else {
      issue.watchers.push(userId)
    }

    await issue.save()

    return res.status(200).json(new apiResponce(200, {
      watching: !isWatching,
      watcherCount: issue.watchers.length
    }, isWatching ? 'Unwatched issue' : 'Now watching issue'))
  } catch (error) {
    console.log('Error watch/unwatch', error)
    throw error
  }
})

export {
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
}