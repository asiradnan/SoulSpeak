import Question from "../models/questionModel.js";

export const getQuestions = async (req, res) => {
    console.log("Received request to get questions");
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
