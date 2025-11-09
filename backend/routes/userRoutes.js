import express from "express";
import { createUser, getAllUsers, getUserByName} from "../controllers/userController.js"
import loginUser from "../controllers/logingContoller.js";
import { authorizeRoles } from "../middleware/authMiddleware.js";
import passport from "passport";


const router = express.Router();


// Creat user Route
router.post("/login", loginUser); //loging route
router.post("/create", passport.authenticate("jwt", { session: false }), authorizeRoles("admin", "super-admin"), createUser); // create user route
router.get("/all", passport.authenticate("jwt", { session: false }), getAllUsers); //get users route
router.get("/search", passport.authenticate("jwt", { session: false }), getUserByName); //get user by name route


// Protected route for all logged-in users
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "Profile data", user: req.user });
  }
);

// Admin-only route
router.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("admin", "super-admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);

// SuperAdmin-only route
router.get(
  "/superadmin",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("super-admin"),
  (req, res) => {
    res.json({ message: "Welcome Super Admin" });
  }
);

//Logout (clear cookie)
router.post("/logout", (req, res) => {
  res.clearCookie("jwt", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production" });
  res.json({ message: "Logged out successfully" });
});

export default router;