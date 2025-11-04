import bcrypt from "bcryptjs";
import mongoose, { connect } from "mongoose";


const userSchema = new mongoose.Schema(
    {
        name : {type: String, required: true, trim:true},
        email : {type: String, required: true, lowercase: true},
        password : {type: String, require: true, minlength: 6 },
        role: {type: String, enum: ["admin", "super-admin", "user"], default: "number"}
    },
    { timestamps: true }
);


//Hashing Password
userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model("user", userSchema);
export default User;