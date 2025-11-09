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

// Get user by name
export const getUserByName = async (req, res) => {
  try {
    const name = req.query.name;

    // If super-admin can find anyone
    if (req.user.role === "super-admin") {
      const user = await User.findOne({ name }).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.json(user);
    }

    // If admin only normal users
    if (req.user.role === "admin") {
      const user = await User.findOne({ name, role: "user" }).select("-password");
      if (!user) return res.status(404).json({ message: "User not found or not allowed" });
      return res.json(user);
    }

    // Normal users can only view their own info
    if (req.user.role === "user") {
      if (req.user.name !== name) {
        return res.status(403).json({ message: "Access denied" });
      }
      const user = await User.findOne({ name: req.user.name }).select("-password");
      return res.json(user);
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user by name
export const updateUserByName = async (req, res) => {
  try {
    const { name } = req.query; 
    const { newName, email, password, role } = req.body;

    // Find user by name
    const user = await User.findOne({ name });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Role restrictions
    if (req.user.role === "user") {
      // User can only update their own profile
      if (req.user.name !== name) {
        return res.status(403).json({ message: "Access denied: cannot update another user" });
      }

      // Allow only password change
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      } else {
        return res.status(400).json({ message: "Only password update is allowed" });
      }
    }

    // Admin can update normal users only (not super-admins or other admins)
    if (req.user.role === "admin") {
      if (user.role === "admin" || user.role === "super-admin") {
        return res.status(403).json({ message: "Access denied: cannot update admin or super-admin" });
      }
    }

    // Super-admin can update anyone
    if (req.user.role === "super-admin" || req.user.role === "admin") {
      if (newName) user.name = newName;
      if (email) user.email = email;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
      if (role && req.user.role === "super-admin") user.role = role; // only super-admin can change role
    }

    const updatedUser = await user.save();
    res.json({
      message: "User updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete user by name
export const deleteUserByName = async (req, res) => {
  try {
    const { name } = req.query;
    const actor = req.user;

    const targetUser = await User.findOne({ name });
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Normal users cannot delete anyone
    if (actor.role === "user") {
      return res.status(403).json({ message: "Access denied: users cannot delete any account" });
    }


    // Admin can only delete normal users
    if (actor.role === "admin" && targetUser.role !== "user") {
      return res.status(403).json({ message: "Access denied: admin can delete only normal users" });
    }

    // Super-admin can delete anyone
    await User.findByIdAndDelete(targetUser._id);
    res.json({ message: `${targetUser.name} has been deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
