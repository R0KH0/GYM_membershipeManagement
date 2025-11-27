import express from "express";
import passport from "passport";
import {
  getDashboardStats,
  getRevenueGrowth,
  getMemberActivity,
  getQuickStats
} from "../controllers/dashboardController.js";

const router = express.Router();

// Protect all routes with JWT authentication
const authenticate = passport.authenticate("jwt", { session: false });

// Dashboard statistics routes
router.get("/stats", authenticate, getDashboardStats);
router.get("/revenue-growth", authenticate, getRevenueGrowth);
router.get("/member-activity", authenticate, getMemberActivity);
router.get("/quick-stats", authenticate, getQuickStats);

export default router;