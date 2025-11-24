import { apiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { apiResponce } from '../utils/apiResponce.js'
import { Issue } from '../models/issue.model.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllIssues = asyncHandler(async (req, res) => {
  const { search, category, status, location, page = 1, limit = 10 } = req.query

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

  const skip = (page - 1) * limit

  const issues = await Issue.find(filter)
    .populate('createdBy', 'fullName email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))

  const total = await Issue.countDocuments(filter)

  return res.status(200).json(new apiResponce(200, {
    issues,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  }, 'Issues retrieved successfully'))
})

const getIssueById = asyncHandler(async (req, res) => {
  const { id } = req.params

  const issue = await Issue.findById(id).populate('createdBy', 'fullName email')

  if (!issue) {
    throw new apiError(404, 'Issue not found')
  }

  return res.status(200).json(new apiResponce(200, issue, 'Issue retrieved successfully'))
})


const createIssue = asyncHandler(async (req, res) => {
  try {

    const { title, description, category, location, priority, tags } = req.body;
    console.log(title);

    if (!(title && description && category && location)) {
      throw new apiError(400, "All required fields must be provided");
    }

    let imageUrl = null;

    // 🟢 Handle image file upload via multer
    if (req.file?.path) {
      const uploaded = await uploadOnCloudinary(req.file.path);
      imageUrl = uploaded?.secure_url || null;
    }

    console.log("ImageURL", imageUrl);

    const issue = await Issue.create({
      title,
      description,
      category,
      location,
      priority: priority || "Medium",
      tags: tags ? tags.split(",").map(t => t.trim()) : [],
      image: imageUrl,
      createdBy: req.user._id,
      status: "Open",
      upvotes: 0
    });

    const populatedIssue = await Issue.findById(issue._id)
      .populate("createdBy", "fullName email");

    console.log("Successfully created issue")
    return res
      .status(201)
      .json(new apiResponce(201, populatedIssue, "Issue created successfully"));
  } catch (error) {
    console.log("Error reporting issue", error);
  }
});


const updateIssue = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { title, description, category, location, image } = req.body

  const issue = await Issue.findById(id)

  if (!issue) {
    throw new apiError(404, 'Issue not found')
  }

  // Check if user is the creator or admin
  if (issue.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'user') {
    throw new apiError(403, 'Not authorized to update this issue')
  }


  const updateData = {}
  if (title) updateData.title = title
  if (description) updateData.description = description
  if (category) updateData.category = category
  if (location) updateData.location = location
  if (image) updateData.image = image

  const updatedIssue = await Issue.findByIdAndUpdate(id, updateData, { new: true })
    .populate('createdBy', 'fullName email')

  return res.status(200).json(new apiResponce(200, updatedIssue, 'Issue updated successfully'))
})

const deleteIssue = asyncHandler(async (req, res) => {
  const { id } = req.params

  const issue = await Issue.findById(id)

  if (!issue) {
    throw new apiError(404, 'Issue not found')
  }

  // Check if user is the creator or admin
  if (issue.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new apiError(403, 'Not authorized to delete this issue')
  }

  await Issue.findByIdAndDelete(id)

  return res.status(200).json(new apiResponce(200, {}, 'Issue deleted successfully'))
})

const upvoteIssue = asyncHandler(async (req, res) => {
  const { id } = req.params
  const userId = req.user._id

  const issue = await Issue.findById(id)

  if (!issue) {
    throw new apiError(404, 'Issue not found')
  }

  // Check if user has already upvoted
  if (issue.upvotedBy.includes(userId)) {
    throw new apiError(400, 'You have already upvoted this issue')
  }

  issue.upvotes += 1
  issue.upvotedBy.push(userId)
  await issue.save()

  return res.status(200).json(new apiResponce(200, { upvotes: issue.upvotes }, 'Issue upvoted successfully'))
})

const updateIssueStatus = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  if (!status) {
    throw new apiError(400, 'Status is required')
  }

  const validStatuses = ['Open', 'In Progress', 'Resolved', 'Closed']
  if (!validStatuses.includes(status)) {
    throw new apiError(400, 'Invalid status')
  }

  const issue = await Issue.findById(id)

  if (!issue) {
    throw new apiError(404, 'Issue not found')
  }

  // Only admin can update status
  if (req.user.role !== 'admin') {
    throw new apiError(403, 'Only admins can update issue status')
  }

  issue.status = status
  await issue.save()

  const updatedIssue = await Issue.findById(id).populate('createdBy', 'fullName email')

  return res.status(200).json(new apiResponce(200, updatedIssue, 'Issue status updated successfully'))
})

export {
  getAllIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
  upvoteIssue,
  updateIssueStatus
}
