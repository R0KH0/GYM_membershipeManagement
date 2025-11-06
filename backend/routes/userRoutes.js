import express from "express";
import createUser from "../controllers/userController.js"
import loginUser from "../controllers/logingContoller.js";


const router = express.Router();


// Creat user Route
router.post("/create", createUser);
router.post("/login", loginUser);



export default router;