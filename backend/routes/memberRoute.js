import express from "express";
import passport from "passport";
import { authorizeRoles } from "../middleware/authMiddleware.js";
import { createMember, getAllMembers, getMemberByName, updateMemberById, deleteMemberById } from "../controllers/memberController.js";

const router = express.Router();

// All routes below require login
router.use(passport.authenticate("jwt", { session: false }));
router.post("/create", createMember);//create member route
router.get("/all", getAllMembers);//get all members route
router.get("/search", getMemberByName);//get member by name route
router.put("/:id", updateMemberById);//update member by id route
router.delete("/:id", authorizeRoles("admin", "super-admin"), deleteMemberById);//delete member by id route

export default router;