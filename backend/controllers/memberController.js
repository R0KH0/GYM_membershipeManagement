import memberSchema from "../models/memberModel.js";

//creat member
const createMember = async (req, res) => {
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


export default createMember;