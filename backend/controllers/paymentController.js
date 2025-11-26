import Payment from "../models/paymentModel.js";
import Member from "../models/memberModel.js";

// Create payment
export const createPayment = async (req, res) => {
  const { member, amount, method, status, periodMonths, notes } = req.body;

  try {
    console.log('Creating payment for member ID:', member);
    
    // ✅ Validate member exists
    const memberExists = await Member.findById(member);
    if (!memberExists) {
      console.error('Member not found:', member);
      return res.status(404).json({ message: "Member not found" });
    }

    console.log('Member found:', memberExists.firstName, memberExists.lastName);

    const newPayment = new Payment({
      member,
      amount: Number(amount),
      method: method || 'cash',
      status: status || 'paid',
      periodMonths: Number(periodMonths) || 1,
      notes: notes || '',
      date: new Date()
    });

    await newPayment.save();
    console.log('Payment created successfully:', newPayment._id);
    
    // Update member's payment status
    memberExists.paymentStatus = 'paid';
    await memberExists.save();

    return res.status(201).json(newPayment);
    
  } catch (error) {
    console.error('Payment creation error:', error);
    return res.status(500).json({ 
      message: "Failed to create payment", 
      error: error.message 
    });
  }
};

// Get all payments (for transactions list)
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('member', 'firstName lastName email phone')
      .sort({ date: -1 })
      .limit(100); // Limit to recent 100 transactions

    // Format response
    const formatted = payments.map(p => ({
      id: p._id,
      memberId: p.member?._id,
      memberName: p.member ? `${p.member.firstName} ${p.member.lastName}`.trim() : 'Unknown',
      memberEmail: p.member?.email,
      memberPhone: p.member?.phone,
      date: p.date,
      amount: p.amount,
      method: p.method,
      status: p.status,
      periodMonths: p.periodMonths,
      notes: p.notes,
      createdAt: p.createdAt
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get earnings statistics
export const getEarningsStats = async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const startOfYear = new Date(currentYear, 0, 1);
    const startOfMonth = new Date(currentYear, currentMonth, 1);

    // Total earnings (all paid payments)
    const totalResult = await Payment.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalEarnings = totalResult[0]?.total || 0;

    // This month's earnings
    const monthResult = await Payment.aggregate([
      { 
        $match: { 
          status: "paid",
          date: { $gte: startOfMonth }
        }
      },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const thisMonthEarnings = monthResult[0]?.total || 0;

    // Year-to-date earnings
    const ytdResult = await Payment.aggregate([
      { 
        $match: { 
          status: "paid",
          date: { $gte: startOfYear }
        }
      },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const ytdEarnings = ytdResult[0]?.total || 0;

    // Calculate previous month for comparison
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
    const prevMonthEarnings = prevMonthResult[0]?.total || 1; // Avoid division by zero

    // Calculate month-over-month change
    const monthChange = prevMonthEarnings > 0 
      ? (((thisMonthEarnings - prevMonthEarnings) / prevMonthEarnings) * 100).toFixed(1)
      : 0;

    res.status(200).json({
      totalEarnings,
      thisMonthEarnings,
      ytdEarnings,
      monthChange: `${monthChange >= 0 ? '+' : ''}${monthChange}%`
    });

  } catch (error) {
    console.error('Error fetching earnings stats:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get monthly earnings data for charts
export const getMonthlyEarnings = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    
    // Get earnings grouped by month for the current year
    const monthlyData = await Payment.aggregate([
      {
        $match: {
          status: "paid",
          date: {
            $gte: new Date(currentYear, 0, 1),
            $lte: new Date(currentYear, 11, 31, 23, 59, 59)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Create array with all 12 months
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = monthNames.map((name, index) => {
      const monthData = monthlyData.find(m => m._id === index + 1);
      return {
        name,
        value: monthData?.total || 0
      };
    });

    res.status(200).json(chartData);

  } catch (error) {
    console.error('Error fetching monthly earnings:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get payment history by member
export const getPaymentsByMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const payments = await Payment.find({ member: memberId })
      .sort({ date: -1 });
    
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching member payments:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete payment
export const deletePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const deleted = await Payment.findByIdAndDelete(paymentId);
    
    if (!deleted) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ message: "Payment deleted successfully" });

  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};