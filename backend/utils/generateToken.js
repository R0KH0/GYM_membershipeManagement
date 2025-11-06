import jwt from "jsonwebtoken";

const generateToken = (userId, userRole) =>{
    return jwt.sign(
        {id: userId, role: userRole},
        process.env.JWT_SECRET,
        { expiresIn: "10min" } 
    );
};

export default generateToken;