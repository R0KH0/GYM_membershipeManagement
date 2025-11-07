import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    match: [/^[0-9]{8,15}$/, "Please enter a valid phone number"],
  },
  email: {type: String, lowecase: true },
}, { timestamps: true });

const Member = mongoose.model("Member", memberSchema);

export default Member;
