import express from "express";
import passport from "passport";
import { authorizeRoles } from "../middleware/authMiddleware.js";
import { 
  createMember, 
  getAllMembers, 
  updateMemberById, 
  deleteMemberById,
  getMemberStats,
  getMonthlyMemberGrowth,
  getDailyMemberGrowth
} from "../controllers/memberController.js";

const router = express.Router();

// All routes below require login
router.use(passport.authenticate("jwt", { session: false }));

// CRUD routes
router.post("/create", createMember);
router.get("/all", getAllMembers);
router.put("/update/:id", updateMemberById);
router.delete("/delete/:id", authorizeRoles("admin", "super-admin"), deleteMemberById);

// Statistics endpoints
router.get('/stats', getMemberStats);
router.get('/growth/monthly', getMonthlyMemberGrowth);
router.get('/growth/daily', getDailyMemberGrowth);

export default router;