import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

//helper to check if the actor can manage the target
const canManageUser = ( actor, target ) => {
    if (actor.role === "super-admin") return true;
    if (actor.role === "admin" && target.role === "user") return true;
    if (actor.role === "user" && actor._id.toString() === target._id.toString()) return true;
    return false;
}

//get all users
export const getAllUsers = async (req, res) => {
  try {
    const role = req.user.role;

    // Normal user can't get user list
    if (role === "user") {
      return res.status(403).json({ message: "Access denied: only admins or super-admins can view user list" });
    }

    let users;

    // Admin can see only normal users
    if (role === "admin") {
      users = await User.find({ role: "user" }).select("-password");
    } 
    // Super-admin can see everyone
    else if (role === "super-admin") {
      users = await User.find().select("-password");
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get user by name
const getUserByname = async (req, res) => {
    try {
        const target = await User.findOne({ name: req.params.name }).select("-password");
        if (!target) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!canManageUser(req.user, target)) {
            return res.status(403).json({ message: "Access denied" });
        }
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// create user
export const createUser = async (req, res) =>{
    const { name , email, password, role } = req.body;

    try{
        // Check if the requester is an Admin or SuperAdmin
        if (req.user.role === "user") {
            return res.status(403).json({ message: "Users cannot create new accounts" });
        }

        // Prevent Admin from creating Admins or SuperAdmins
        if (req.user.role === "admin" && role !== "user") {
            return res.status(403).json({ message: "Admins can only create regular users" });
        }

        // if user already exits
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({ message: "User already exists" });
        }

        //create new one
        const user = new User({name, email, password, role: role || "user"});
        const savedUser = await user.save();
        
        res.status(201).json({
            _id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            role: savedUser.role,
        });
    }catch (error) {
    res.status(500).json({ message: error.message });
  }
};