import { Router } from "express";
import {
  getDashboardStats,
  getDashboardCharts,
  getPublicStats,
  getLeaderboard
} from "../controllers/dashboard.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/role.middleware.js";

const router = Router();

// Public — home page hero stats (no auth required)
router.route("/public-stats").get(getPublicStats);

// Public — citizen leaderboard (no auth required)
router.route("/leaderboard").get(getLeaderboard);

// Admin only
router.route("/stats").get(verifyJwt, verifyAdmin, getDashboardStats);
router.route("/charts").get(verifyJwt, verifyAdmin, getDashboardCharts);

export { router };