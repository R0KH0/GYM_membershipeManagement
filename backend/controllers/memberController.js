import Member from "../models/memberModel.js";
import User from "../models/userModel.js";

// Create member
export const createMember = async (req, res) => {
  const { firstName, lastName, email, phone, startDate, endDate, notes, status } = req.body;

  try {
    // check if existing member by name + phone
    const existing = await Member.findOne({ firstName, lastName, phone });
    if (existing) {
      return res.status(400).json({ message: "Member already exists" });
    }

    const newMember = new Member({
      firstName,
      lastName,
      email,
      phone,
      startDate,
      endDate,
      notes,
      status: status || "pending",
      createdBy: req.user._id,
    });

    await newMember.save();
    await newMember.populate("createdBy", "name email");

    return res.status(201).json({
      message: "Member created successfully",
      member: newMember,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Get all members
export const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update member by ID
export const updateMemberById = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, status, startDate, endDate, notes } = req.body;

  try {
    const updated = await Member.findByIdAndUpdate(
      id,
      { firstName, lastName, email, phone, status, startDate, endDate, notes },
      { new: true }
    ).populate("createdBy", "name email");

    if (!updated) {
      return res.status(404).json({ message: "Member not found" });
    }

    return res.status(200).json({
      message: "Member updated successfully",
      member: updated,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Delete member by ID
export const deleteMemberById = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Member.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Member not found" });
    }

    return res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Get member statistics (for dashboard stat cards)
export const getMemberStats = async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const startOfMonth = new Date(currentYear, currentMonth, 1);

    const totalMembers = await Member.countDocuments();
    const activeMembers = await Member.countDocuments({ status: "active" });
    const newMembersThisMonth = await Member.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const prevMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const prevMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59);
    const newMembersPrevMonth = await Member.countDocuments({
      createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd },
    });

    const memberChange =
      newMembersPrevMonth > 0
        ? (
            ((newMembersThisMonth - newMembersPrevMonth) / newMembersPrevMonth) *
            100
          ).toFixed(1)
        : 0;

    res.status(200).json({
      totalMembers,
      activeMembers,
      newMembersThisMonth,
      memberChange: `${memberChange >= 0 ? "+" : ""}${memberChange}%`,
    });
  } catch (error) {
    console.error("Error fetching member stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get member growth data - MONTHLY view for entire year
export const getMonthlyMemberGrowth = async (req, res) => {
  try {
    const year = req.query.year
      ? parseInt(req.query.year)
      : new Date().getFullYear();

    const monthlyNewMembers = await Member.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(year, 0, 1),
            $lte: new Date(year, 11, 31, 23, 59, 59),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          newMembers: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const chartData = [];

    for (let i = 0; i < 12; i++) {
      const monthIndex = i + 1;
      const endOfMonth = new Date(year, i, 31, 23, 59, 59);

      const totalMembers = await Member.countDocuments({
        createdAt: { $lte: endOfMonth },
      });

      const monthData = monthlyNewMembers.find(
        (m) => m._id === monthIndex
      );
      const newMembers = monthData?.newMembers || 0;

      chartData.push({
        name: monthNames[i],
        totalMembers,
        newMembers,
      });
    }

    res.status(200).json(chartData);
  } catch (error) {
    console.error("Error fetching monthly member growth:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get member growth data - DAILY view for specific month
export const getDailyMemberGrowth = async (req, res) => {
  try {
    const year = req.query.year
      ? parseInt(req.query.year)
      : new Date().getFullYear();
    const month = req.query.month
      ? parseInt(req.query.month) - 1
      : new Date().getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dailyNewMembers = await Member.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(year, month, 1),
            $lte: new Date(year, month, daysInMonth, 23, 59, 59),
          },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          newMembers: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const chartData = [];
    let cumulativeMembers = 0;

    const beforeMonth = await Member.countDocuments({
      createdAt: { $lt: new Date(year, month, 1) },
    });

    cumulativeMembers = beforeMonth;

    for (let day = 1; day <= daysInMonth; day++) {
      const dayData = dailyNewMembers.find((d) => d._id === day);
      const newMembers = dayData?.newMembers || 0;
      cumulativeMembers += newMembers;

      chartData.push({
        name: `${day}`,
        day: day,
        totalMembers: cumulativeMembers,
        newMembers,
      });
    }

    res.status(200).json(chartData);
  } catch (error) {
    console.error("Error fetching daily member growth:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};