import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["jwt"];
    }
    return token;
};

const opts = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET,
};

export default (passport) => {
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => { // ✅ Fixed typo
            try {
                const user = await User.findById(jwt_payload.id).select("-password");
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            } catch (error) { // ✅ Fixed variable name
                return done(error, false);
            }
        })
    );
};