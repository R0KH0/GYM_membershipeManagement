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

// Update user 
export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    // Find target user to update
    const target = await User.findById(id);
    if (!target) return res.status(404).json({ message: "User not found" });

    const requester = req.user; // logged-in user

    /*ROLE PERMISSIONS LOGIC*/

    // --- EMPLOYEE ROLE ---
    if (requester.role === "employee") {
      if (requester._id.toString() !== id) {
        return res.status(403).json({ message: "Employees can update only themselves" });
      }

      if (!password) {
        return res.status(400).json({ message: "Only password update is allowed" });
      }

      const salt = await bcrypt.genSalt(10);
      target.password = await bcrypt.hash(password, salt);
    }

    // --- ADMIN ROLE ---
    else if (requester.role === "admin") {
      // Admin CANNOT update super-admin
      if (target.role === "super-admin") {
        return res.status(403).json({ message: "Admins cannot update super-admins" });
      }

      // Admin cannot change role
      if (role) {
        return res.status(403).json({ message: "Admins cannot change roles" });
      }

      // Admin can update name/email/password
      if (name) target.name = name;
      if (email) target.email = email;

      if (password) {
        const salt = await bcrypt.genSalt(10);
        target.password = await bcrypt.hash(password, salt);
      }
    }

    // --- SUPER ADMIN ROLE ---
    else if (requester.role === "super-admin") {
      // Super-admin can update everything
      if (name) target.name = name;
      if (email) target.email = email;

      if (password) {
        const salt = await bcrypt.genSalt(10);
        target.password = await bcrypt.hash(password, salt);
      }

      if (role) target.role = role;
    }

    // Save updated user
    await target.save();

    res.json({
      message: "User updated successfully",
      updatedUser: {
        id: target._id,
        name: target.name,
        email: target.email,
        role: target.role,
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Delete user by name
export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const actor = req.user; 

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // EMPLOYEE → cannot delete anyone
    if (actor.role === "employee") {
      return res.status(403).json({
        message: "Access denied: employees cannot delete accounts",
      });
    }

    // ADMIN rules
    if (actor.role === "admin") {
      // admin CANNOT delete super-admin
      if (targetUser.role === "super-admin") {
        return res.status(403).json({
          message: "Access denied: admins cannot delete super-admin accounts",
        });
      }

      // admin CAN delete admin & employee → allowed
    }

    // SUPER-ADMIN rules
    if (actor.role === "super-admin") {
      // super-admin cannot delete themselves
      if (actor._id.toString() === id) {
        return res.status(403).json({
          message: "Super-admin cannot delete their own account",
        });
      }
      // super-admin can delete anyone else
    }

    // Perform delete
    await User.findByIdAndDelete(targetUser._id);

    res.json({
      message: `${targetUser.name} has been deleted successfully`,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
