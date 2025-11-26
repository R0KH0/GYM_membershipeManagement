import express from "express";
import passport from "passport";
import { authorizeRoles } from "../middleware/authMiddleware.js";
import { createMember, getAllMembers, updateMemberById, deleteMemberById } from "../controllers/memberController.js";

const router = express.Router();

// All routes below require login
router.use(passport.authenticate("jwt", { session: false }));
router.post("/create", createMember);//create member route
router.get("/all", getAllMembers);//get all members route
router.put("/update/:id", updateMemberById);//update member by id route
router.delete("/delete/:id", authorizeRoles("admin", "super-admin"), deleteMemberById);//delete member by id route

export default router;