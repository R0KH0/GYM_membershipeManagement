import express from "express";
import {createUser} from "../controllers/userController.js"


const router = express.Router();


// Creat user Route
router.post("/create", createUser);



export default router;