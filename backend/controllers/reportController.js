import Report from '../models/Report.js';
import User from "../models/userModel.js";

export const getReports = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.email == "admin@gmail.com") {
            const reports = await Report.find();
            return res.status(200).json(reports);
        }
        const reports = await Report.find({userEmail: user.email});

        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createReport = async (req, res) => {
    console.log("Received request to create a report");
    try {
        const { userEmail, type, details } = req.body;
        const newReport = new Report({
            userEmail,
            type,
            details
        });
        console.log("New report created:", newReport);
        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
