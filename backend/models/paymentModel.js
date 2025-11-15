import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  member: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Member", 
    required: true 
  },

  amount: { type: Number, required: true },

  method: { 
    type: String, 
    enum: ["cash", "card", "bank", "online"], 
    default: "cash" 
  },

  status: { 
    type: String, 
    enum: ["paid", "unpaid"], 
    default: "paid" 
  },

  periodMonths: { type: Number, default: 1 },

  date: { type: Date, default: Date.now },

  notes: String

}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);