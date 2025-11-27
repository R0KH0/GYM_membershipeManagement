import Notification from "../models/notificationModel.js";
import Member from "../models/memberModel.js";

// Create a notification (used internally by other controllers)
export const createNotification = async (type, message, relatedMember = null, createdBy = null) => {
  try {
    const notification = new Notification({
      type,
      message,
      relatedMember,
      createdBy
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Get all notifications for current user (unread first)
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({
      readBy: { $ne: userId } // Not read by current user
    })
      .populate('relatedMember', 'firstName lastName')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(20);

    // Format notifications
    const formatted = notifications.map(notif => ({
      id: notif._id,
      type: notif.type,
      message: notif.message,
      memberName: notif.relatedMember 
        ? `${notif.relatedMember.firstName} ${notif.relatedMember.lastName}`.trim()
        : null,
      createdByName: notif.createdBy?.name || 'System',
      time: getTimeAgo(notif.createdAt),
      isRead: notif.readBy.includes(userId),
      createdAt: notif.createdAt
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Add user to readBy array if not already there
    if (!notification.readBy.includes(userId)) {
      notification.readBy.push(userId);
      await notification.save();
    }

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      { readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Check for expiring subscriptions (run this as a cron job or scheduled task)
export const checkExpiringSubscriptions = async (req, res) => {
  try {
    const today = new Date();
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);

    // Find members whose subscription expires in 3 days or less
    const expiringMembers = await Member.find({
      endDate: {
        $gte: today,
        $lte: threeDaysFromNow
      },
      status: 'active'
    });

    // Create notifications for expiring subscriptions
    for (const member of expiringMembers) {
      const daysUntilExpiry = Math.ceil((new Date(member.endDate) - today) / (1000 * 60 * 60 * 24));
      
      // Check if notification already exists for this member
      const existingNotif = await Notification.findOne({
        type: 'subscription_expiring',
        relatedMember: member._id,
        createdAt: { $gte: new Date(today.setHours(0, 0, 0, 0)) }
      });

      if (!existingNotif) {
        await createNotification(
          'subscription_expiring',
          `${member.firstName} ${member.lastName}'s subscription expires in ${daysUntilExpiry} day(s)`,
          member._id,
          null
        );
      }
    }

    // Find expired subscriptions
    const expiredMembers = await Member.find({
      endDate: { $lt: today },
      status: 'active'
    });

    // Update status and create notifications
    for (const member of expiredMembers) {
      member.status = 'expired';
      await member.save();

      await createNotification(
        'subscription_expired',
        `${member.firstName} ${member.lastName}'s subscription has expired`,
        member._id,
        null
      );
    }

    res.status(200).json({ 
      message: "Subscription check completed",
      expiring: expiringMembers.length,
      expired: expiredMembers.length
    });
  } catch (error) {
    console.error('Error checking subscriptions:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Helper function to format time ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) > 1 ? 's' : ''} ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) > 1 ? 's' : ''} ago`;
  
  return new Date(date).toLocaleDateString();
}