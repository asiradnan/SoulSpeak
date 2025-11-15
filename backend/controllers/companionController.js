import User from "../models/userModel.js";

export const becomeCompanion = async (req, res) => {
    console.log("Received request to update companion status");
    try {
        const id = req.user.id;
        await User.findByIdAndUpdate(id, {
            isCompanion: true
        })
        return res.status(200).json({ message: "Companion status updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const getCompanions = async (req, res) => {
    console.log("Received request to get companions");
    try {
        const companions = await User.find({ isCompanion: true });
        res.status(200).json(companions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
