import express from "express";
import passport from "passport";
import { authorizeRoles } from "../middleware/authMiddleware.js";
import { createMember, getAllMembers, getMemberByName, updateMemberByName, deleteMemberByName } from "../controllers/memberController.js";

const router = express.Router();

// All routes below require login
router.use(passport.authenticate("jwt", { session: false }));
router.post("/create", createMember);//create member route
router.get("/all", getAllMembers);//get all members route
router.get("/search", getMemberByName);//get member by name route
router.put("/update", updateMemberByName);//update member by name route
router.delete("/:name", authorizeRoles("admin", "super-admin"), deleteMemberByName);//delete member by name route

export default router;