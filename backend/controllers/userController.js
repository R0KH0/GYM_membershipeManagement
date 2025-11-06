import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";



// create user
const createUser = async (req, res) =>{
    const { name , email, password, role } = req.body;

    try{
        // if user already exits
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({ message: "User already exists" });
        }
        
        //creat new one
        const user = new User({name, email, password, role: role || "member"});
        const savedUser = await user.save();
        
        res.status(201).json({
            _id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            role: savedUser.role,
            token: generateToken(savedUser._id),
        });
    }catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default createUser;