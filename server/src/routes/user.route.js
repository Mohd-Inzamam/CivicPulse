// // user.route.js
import { Router } from "express";
import {
  getCurrentUser,
  getAllUsers,
  getUserById,
  deleteUser,
  toggleUserStatus,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js"; // Assuming your JWT middleware path

const router = Router();

// Routes protected by JWT middleware

// GET /api/v1/users/me - Get the logged-in user's profile
router.route("/me").get(verifyJwt, getCurrentUser);

// GET /api/v1/users - Get all users (Admin/Staff)
// POST /api/v1/users/:id/status - Admin/Staff only
router.route("/")
  .get(verifyJwt, getAllUsers);

// GET /api/v1/users/:id - Get user by ID (Admin/Staff or Self)
// DELETE /api/v1/users/:id - Delete user (Admin only)
router.route("/:id")
  .get(verifyJwt, getUserById)
  .delete(verifyJwt, deleteUser);

// PATCH /api/v1/users/:id/status - Toggle user active/inactive status
router.route("/:id/status").patch(verifyJwt, toggleUserStatus);


export { router };