import express from "express";
import { createPayment, getPaymentsByMember, deletePayment } from "../controllers/paymentController.js";
import passport from "passport";

const router = express.Router();

// All payment routes protected
router.use(passport.authenticate("jwt", { session: false }));

router.post("/create", createPayment);
router.get("/:memberId", getPaymentsByMember);
router.delete("/delete/:id", deletePayment);

export default router;