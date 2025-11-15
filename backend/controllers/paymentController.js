import Payment from "../models/paymentModel.js";
import Member from "../models/memberModel.js";

// Create payment
export const createPayment = async (req, res) => {
  try {
    const { memberId, amount, method, periodMonths, notes } = req.body;

    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ message: "Member not found" });

    // --- Membership logic ---
    const now = new Date();

    // If new member → membership starts now
    if (!member.startDate || !member.endDate || member.endDate < now) {
      member.startDate = now;
      member.endDate = new Date(now.setMonth(now.getMonth() + periodMonths));
    } else {
      // If active → extend endDate
      member.endDate = new Date(member.endDate.setMonth(member.endDate.getMonth() + periodMonths));
    }

    member.status = "active";
    member.paymentStatus = "paid";
    await member.save();

    // Create payment record
    const payment = new Payment({
      member: memberId,
      amount,
      method,
      periodMonths,
      notes
    });

    await payment.save();

    res.status(201).json({
      message: "Payment added successfully",
      payment,
      member
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get payment history
export const getPaymentsByMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const payments = await Payment.find({ member: memberId }).sort({ date: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete payment
export const deletePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    await Payment.findByIdAndDelete(paymentId);
    res.status(200).json({ message: "Payment deleted" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};