import memberSchema from "../models/memberModel.js";

// creat member
export const createMember = async (req, res) => {
    const { fullName, email, phoneNumber } = req.body;
    
    try {
        const existingMember = await memberSchema.findOne({ fullName });
        if (existingMember) {
            return res.status(400).json({ message: "Member already exists" });
        }
        const newMember = new memberSchema({ fullName, email, phoneNumber });
        await newMember.save();
        return res.status(201).json({ message: "Member created successfully", member: newMember });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}

// Get all members
export const getAllMembers = async (req, res) => {
  try {
    const members = await memberSchema.find();
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get member by name
export const getMemberByName = async (req, res) => {
  const { name } = req.query;

  try {
    const member = await memberSchema.findOne({ fullName: name });
    if (!member) return res.status(404).json({ message: "Member not found" });

    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update member by name
export const updateMemberByName = async (req, res) => {
  const { name } = req.query;
  const { email, phoneNumber } = req.body;

  try {
    const updatedMember = await memberSchema.findOneAndUpdate(
      { fullName: name },
      { email, phoneNumber },
      { new: true }
    );

    if (!updatedMember)
      return res.status(404).json({ message: "Member not found" });

    res.status(200).json({ message: "Member updated successfully", member: updatedMember });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete member by name
export const deleteMemberByName = async (req, res) => {
  const { name } = req.query;

  try {
    const deletedMember = await memberSchema.findOneAndDelete({ fullName: name });
    if (!deletedMember)
      return res.status(404).json({ message: "Member not found" });

    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};