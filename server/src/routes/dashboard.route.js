import { Router } from "express";
import {
  getDashboardStats,
  getDashboardCharts,
} from "../controllers/dashboard.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/role.middleware.js"; // ✅ NEW

const router = Router();

// ✅ Only admins can access dashboard stats & charts
router.route("/stats").get(verifyJwt, verifyAdmin, getDashboardStats);
router.route("/charts").get(verifyJwt, verifyAdmin, getDashboardCharts);

export { router };
