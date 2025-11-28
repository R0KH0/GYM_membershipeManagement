import express from "express";
import passport from "passport";
import {
  createPayment,
  getAllPayments,
  getEarningsStats,
  getMonthlyEarnings,
  getDailyEarnings,
  getPaymentsByMember,
  deletePayment
} from "../controllers/paymentController.js";

const router = express.Router();

// All payment routes protected
router.use(passport.authenticate("jwt", { session: false }));

router.post("/create", createPayment);
router.get("/all", getAllPayments);
router.get("/member/:memberId", getPaymentsByMember);
router.delete("/delete/:paymentId", deletePayment);

// Earnings/Statistics routes
router.get("/earnings/stats", getEarningsStats);
router.get("/earnings/monthly", getMonthlyEarnings);
router.get("/earnings/daily", getDailyEarnings);

export default router;