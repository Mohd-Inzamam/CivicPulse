// user.controller.js
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponce } from "../utils/apiResponce.js";
import { User } from "../models/user.model.js";

// 🚀 Get the currently logged-in user's details
const getCurrentUser = asyncHandler(async (req, res) => {
    // req.user is populated by the authentication middleware
    const user = await User.findById(req.user?._id).select(
        "-password -refreshToken -confirmPassword"
    );

    if (!user) {
        // This should theoretically not happen if middleware runs correctly
        throw new apiError(404, "Authenticated user not found in DB");
    }

    return res
        .status(200)
        .json(new apiResponce(200, { user }, "Current user details fetched successfully"));
});

// 🚀 Get a list of all users (Admin/Staff only)
const getAllUsers = asyncHandler(async (req, res) => {
    // 1. Authorization Check
    if (req.user.role !== "admin" && req.user.role !== "staff") {
        throw new apiError(403, "Access denied. Only Admins/Staff can view all users.");
    }

    // 2. Pagination and Filtering from query parameters
    const { page = 1, limit = 10, search, role } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
        filter.$or = [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { SSN: { $regex: search, $options: "i" } },
        ];
    }

    const users = await User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .select("-password -refreshToken -confirmPassword")
        .lean(); // Use .lean() for faster query performance

    const totalUsers = await User.countDocuments(filter);

    return res.status(200).json(
        new apiResponce(
            200,
            {
                users,
                pagination: {
                    totalResults: totalUsers,
                    page: pageNumber,
                    limit: limitNumber,
                    totalPages: Math.ceil(totalUsers / limitNumber),
                },
            },
            "Users list fetched successfully"
        )
    );
});

// 🚀 Get a specific user by ID (Admin/Staff only)
const getUserById = asyncHandler(async (req, res) => {
    // 1. Authorization Check (Self or Admin/Staff)
    const userId = req.params.id;
    if (req.user._id.toString() !== userId && req.user.role !== "admin" && req.user.role !== "staff") {
        throw new apiError(403, "Access denied. Cannot view other user details.");
    }

    const user = await User.findById(userId).select("-password -refreshToken -confirmPassword");

    if (!user) {
        throw new apiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new apiResponce(200, { user }, "User details fetched successfully"));
});

// 🚀 Delete a user by ID (Admin only)
const deleteUser = asyncHandler(async (req, res) => {
    // 1. Authorization Check (Strictly Admin)
    if (req.user.role !== "admin") {
        throw new apiError(403, "Access denied. Only Admins can delete users.");
    }

    const userId = req.params.id;

    // Prevent deleting your own account via this endpoint (safer practice)
    if (req.user._id.toString() === userId) {
        throw new apiError(400, "Cannot delete your own account via this endpoint.");
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
        throw new apiError(404, "User not found");
    }

    return res.status(200).json(new apiResponce(200, {}, "User deleted successfully"));
});

// 🚀 Admin: Toggle user activation status (Admin only)
const toggleUserStatus = asyncHandler(async (req, res) => {
    // 1. Authorization Check (Admin/Staff only)
    if (req.user.role !== "admin" && req.user.role !== "staff") {
        throw new apiError(403, "Access denied. Only Admins/Staff can modify user status.");
    }

    const userId = req.params.id;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
        throw new apiError(400, "Status must be a boolean value (isActive).");
    }

    // Prevent locking your own account
    if (req.user._id.toString() === userId && isActive === false) {
        throw new apiError(400, "You cannot deactivate your own administrative account.");
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { isActive: isActive } },
        { new: true, runValidators: true }
    ).select("-password -refreshToken -confirmPassword");

    if (!updatedUser) {
        throw new apiError(404, "User not found");
    }

    return res.status(200).json(
        new apiResponce(
            200,
            { user: updatedUser },
            `User account successfully ${isActive ? 'activated' : 'deactivated'}.`
        )
    );
});


export {
    getCurrentUser,
    getAllUsers,
    getUserById,
    deleteUser,
    toggleUserStatus,
};