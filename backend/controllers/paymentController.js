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