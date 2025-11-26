import Member from "../models/memberModel.js";

// Create member
export const createMember = async (req, res) => {
  const { firstName, lastName, email, phone, startDate, endDate, notes } = req.body;

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
      status: "pending",
      createdBy: req.user?._id, // requires auth middleware
    });

    await newMember.save();

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
    const members = await Member.find(); // return all members
    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get member by name (still allowed)
export const getMemberByName = async (req, res) => {
  const { name } = req.query;

  try {
    const member = await Member.findOne({ firstName: name });
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update member by ID
export const updateMemberById = async (req, res) => {
  const { id } = req.params; // use ID from route params
  const { firstName, lastName, email, phone, status, startDate, endDate, notes } = req.body;

  try {
    const updated = await Member.findByIdAndUpdate(
      id,
      { firstName, lastName, email, phone, status, startDate, endDate, notes },
      { new: true }
    );

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
  const { id } = req.params; // use ID from route params

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
