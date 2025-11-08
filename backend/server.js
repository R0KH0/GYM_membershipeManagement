import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import memberRoutes from "./routes/memberRoute.js";
import cookieParser from "cookie-parser";
import passportConfig from "./config/passport.js";
import passport from "passport";    

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());
passportConfig(passport);

//allows cookies
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: "http://localhost:3000", // frontend URL
  credentials: true, // allow cookies
}));

// Routes
app.use("/api/users", userRoutes);//user routes
app.use("/api/members", memberRoutes);//member routes



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port http://localhost:5000/`);
});