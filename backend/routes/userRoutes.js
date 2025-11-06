import express from "express";
import createUser from "../controllers/userController.js"
import loginUser from "../controllers/logingContoller.js";
import passport from "passport";


const router = express.Router();


// Creat user Route
router.post("/create", createUser);
router.post("/login", loginUser);


// Protected route for all logged-in users
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "Profile data", user: req.user });
  }
);

// Role-based access
const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

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