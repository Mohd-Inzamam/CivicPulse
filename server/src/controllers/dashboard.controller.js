import { apiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { apiResponce } from '../utils/apiResponce.js'
import { Issue } from '../models/issue.model.js'
import { User } from '../models/user.model.js'

const getDashboardStats = asyncHandler(async (req, res) => {
  const totalIssues = await Issue.countDocuments()
  const openIssues = await Issue.countDocuments({ status: 'Open' })
  const inProgressIssues = await Issue.countDocuments({ status: 'In Progress' })
  const resolvedIssues = await Issue.countDocuments({ status: 'Resolved' })
  const closedIssues = await Issue.countDocuments({ status: 'Closed' })

  const totalUsers = await User.countDocuments()
  const verifiedUsers = await User.countDocuments({ isEmailVerified: true })

  const stats = {
    issues: {
      total: totalIssues,
      open: openIssues,
      inProgress: inProgressIssues,
      resolved: resolvedIssues,
      closed: closedIssues
    },
    users: {
      total: totalUsers,
      verified: verifiedUsers,
      unverified: totalUsers - verifiedUsers
    }
  }

  return res.status(200).json(new apiResponce(200, stats, 'Dashboard stats retrieved successfully'))
})

const getDashboardCharts = asyncHandler(async (req, res) => {
  // Category distribution
  const categoryStats = await Issue.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ])

  // Status distribution
  const statusStats = await Issue.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ])

  // Monthly issue creation trend (last 12 months)
  const monthlyTrend = await Issue.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
        }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ])

  // Priority distribution
  const priorityStats = await Issue.aggregate([
    { $group: { _id: '$priority', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ])

  // Top locations with most issues
  const locationStats = await Issue.aggregate([
    { $group: { _id: '$location', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ])

  const charts = {
    categoryDistribution: categoryStats,
    statusDistribution: statusStats,
    monthlyTrend: monthlyTrend,
    priorityDistribution: priorityStats,
    topLocations: locationStats
  }

  return res.status(200).json(new apiResponce(200, charts, 'Dashboard charts retrieved successfully'))
})

export {
  getDashboardStats,
  getDashboardCharts
}
