import Payment from "../models/paymentModel.js";
import Member from "../models/memberModel.js";

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const startOfYear = new Date(currentYear, 0, 1);

    // Total Earnings
    const totalEarningsResult = await Payment.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalEarnings = totalEarningsResult[0]?.total || 0;

    // This Month Earnings
    const thisMonthResult = await Payment.aggregate([
      { 
        $match: { 
          status: "paid",
          date: { $gte: startOfMonth }
        }
      },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const thisMonthEarnings = thisMonthResult[0]?.total || 0;

    // Previous month for comparison
    const prevMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const prevMonthEnd = new Date(currentYear, currentMonth, 0);
    const prevMonthResult = await Payment.aggregate([
      { 
        $match: { 
          status: "paid",
          date: { $gte: prevMonthStart, $lte: prevMonthEnd }
        }
      },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const prevMonthEarnings = prevMonthResult[0]?.total || 1;

    // Calculate earnings change percentage
    const earningsChange = prevMonthEarnings > 0 
      ? (((thisMonthEarnings - prevMonthEarnings) / prevMonthEarnings) * 100).toFixed(1)
      : 0;

    // Total Members Count
    const totalMembers = await Member.countDocuments();

    // New members this month
    const newMembersThisMonth = await Member.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // New members last month
    const newMembersPrevMonth = await Member.countDocuments({
      createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd }
    });

    // Calculate member growth change
    const memberChange = newMembersPrevMonth > 0
      ? (((newMembersThisMonth - newMembersPrevMonth) / newMembersPrevMonth) * 100).toFixed(1)
      : 0;

    res.status(200).json({
      totalEarnings,
      thisMonthEarnings,
      earningsChange: `${earningsChange >= 0 ? '+' : ''}${earningsChange}%`,
      totalMembers,
      memberChange: `${memberChange >= 0 ? '+' : ''}${memberChange}%`
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get revenue growth data (last 7 months)
export const getRevenueGrowth = async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Calculate start month (7 months ago)
    let startMonth = currentMonth - 6;
    let startYear = currentYear;
    
    if (startMonth < 0) {
      startMonth += 12;
      startYear -= 1;
    }

    // Get monthly earnings for the last 7 months
    const monthlyData = await Payment.aggregate([
      {
        $match: {
          status: "paid",
          date: {
            $gte: new Date(startYear, startMonth, 1)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Create array for last 7 months
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = [];

    for (let i = 0; i < 7; i++) {
      let targetMonth = startMonth + i;
      let targetYear = startYear;
      
      if (targetMonth > 11) {
        targetMonth -= 12;
        targetYear += 1;
      }

      const monthData = monthlyData.find(
        m => m._id.year === targetYear && m._id.month === targetMonth + 1
      );

      chartData.push({
        name: monthNames[targetMonth],
        value: monthData?.total || 0
      });
    }

    res.status(200).json(chartData);

  } catch (error) {
    console.error('Error fetching revenue growth:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get member activity data (last 7 months)
export const getMemberActivity = async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Calculate start month (7 months ago)
    let startMonth = currentMonth - 6;
    let startYear = currentYear;
    
    if (startMonth < 0) {
      startMonth += 12;
      startYear -= 1;
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = [];

    // Get new members per month
    const newMembersData = await Member.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startYear, startMonth, 1)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    let cumulativeTotal = await Member.countDocuments({
      createdAt: { $lt: new Date(startYear, startMonth, 1) }
    });

    for (let i = 0; i < 7; i++) {
      let targetMonth = startMonth + i;
      let targetYear = startYear;
      
      if (targetMonth > 11) {
        targetMonth -= 12;
        targetYear += 1;
      }

      const newMembersInMonth = newMembersData.find(
        m => m._id.year === targetYear && m._id.month === targetMonth + 1
      );

      const newMembers = newMembersInMonth?.count || 0;
      cumulativeTotal += newMembers;

      chartData.push({
        name: monthNames[targetMonth],
        totalMembers: cumulativeTotal,
        newMembers: newMembers
      });
    }

    res.status(200).json(chartData);

  } catch (error) {
    console.error('Error fetching member activity:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get quick overview stats
export const getQuickStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Active members
    const activeMembers = await Member.countDocuments({ 
      status: 'active' 
    });

    // Pending members
    const pendingMembers = await Member.countDocuments({ 
      status: 'pending' 
    });

    // Today's earnings
    const todayEarnings = await Payment.aggregate([
      { 
        $match: { 
          status: "paid",
          date: { $gte: startOfToday }
        }
      },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // Today's new members
    const todayNewMembers = await Member.countDocuments({
      createdAt: { $gte: startOfToday }
    });

    res.status(200).json({
      activeMembers,
      pendingMembers,
      todayEarnings: todayEarnings[0]?.total || 0,
      todayNewMembers
    });

  } catch (error) {
    console.error('Error fetching quick stats:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};