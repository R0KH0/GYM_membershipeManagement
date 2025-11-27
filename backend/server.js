import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import memberRoutes from "./routes/memberRoute.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import notificationRoutes from "./routes/paymentRoutes.js";
import cookieParser from "cookie-parser";
import passportConfig from "./config/passport.js";
import passport from "passport";
import { startCronJobs } from "./utils/cronJobs.js";

dotenv.config();
connectDB();

const app = express();

// ----- MUST COME BEFORE ROUTES -----
app.use(cookieParser());

// ----- CORRECT CORS SETUP (ONLY THIS ONE) -----
app.use(
  cors({
    origin: "http://localhost:3000", // your React frontend
    credentials: true, // allow HttpOnly cookies
  })
);

// ----- BODY PARSERS -----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----- PASSPORT -----
app.use(passport.initialize());
passportConfig(passport);

// ----- ROUTES -----
app.use("/api/users", userRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port http://localhost:${PORT}/`);
  startCronJobs();
});