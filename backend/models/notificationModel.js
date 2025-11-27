import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['member_added', 'subscription_expiring', 'subscription_expired', 'payment', 'system'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    relatedMember: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      default: null
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    isRead: {
      type: Boolean,
      default: false
    },
    readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;