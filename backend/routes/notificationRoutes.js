import express from "express";
import passport from "passport";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  checkExpiringSubscriptions
} from "../controllers/notificationController.js";

const router = express.Router();

// All routes require authentication
router.use(passport.authenticate("jwt", { session: false }));

router.get("/all", getNotifications);
router.put("/read/:notificationId", markAsRead);
router.put("/read-all", markAllAsRead);
router.post("/check-expiring", checkExpiringSubscriptions);

export default router;