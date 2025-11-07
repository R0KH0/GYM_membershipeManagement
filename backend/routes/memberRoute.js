import express from "express";
import passport from "passport";
import createMember from "../controllers/memberController.js";

const router = express.Router();

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  createMember
);

export default router;