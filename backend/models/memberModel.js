import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String },
    phone: { type: String },
    status: { type: String, enum: ['active','expired','frozen','pending','cancelled'], default: 'pending' },
    startDate: { type: Date },
    endDate: { type: Date },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    paymentStatus: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' }
  },{ timestamps: true }
);

const Member = mongoose.model("Member", memberSchema);

export default Member;
