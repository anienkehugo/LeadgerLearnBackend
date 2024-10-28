const Quiz = require("../models/Quiz");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

// @desc Get all quizzes
// @route GET /quizzes
// @access Public
const getAllQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find().lean();
  if (!quizzes.length) {
    return res.status(404).json({ message: "No quizzes found" });
  }
  res.json(quizzes);
});

// @desc Get a quiz by ID
// @route GET /quizzes/:id
// @access Public
const getQuizById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("Received Quiz ID:", id);

  // Get all quizzes
  const quizzes = await Quiz.find().lean(); // Fetch all quizzes

  // Iterate through quizzes and find the matching one
  const quiz = quizzes.find((quiz) => quiz._id.toString() === id);

  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  res.json(quiz);
});

// const getQuizById = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   console.log("Received Quiz ID:", id);
//   const quiz = await Quiz.findById(id).lean();
//   if (!quiz) {
//     return res.status(404).json({ message: "Quiz not found" });
//   }
//   res.json(quiz);
// });

// @desc Create a new quiz
// @route POST /quizzes
// @access Private
const createQuiz = asyncHandler(async (req, res) => {
  const { title, questions } = req.body;
  const quizID = uuidv4(); // Generate unique quiz ID

  // Validate input
  if (!title || !questions || !questions.length) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Create and store new quiz
  const newQuiz = new Quiz({
    quizID,
    title,
    questions,
  });
  const savedQuiz = await newQuiz.save();

  res.status(201).json(savedQuiz);
});

// @desc Update a quiz by ID
// @route PATCH /quizzes/:id
// @access Private
const updateQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params; // This is the `quizID` from the request

  // Check if the quiz exists by its `quizID`
  const quiz = await Quiz.findOne({ quizID: id });
  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  // Update quiz fields if provided
  const { title, questions } = req.body;
  if (title) quiz.title = title;
  if (questions && questions.length) quiz.questions = questions;

  // Save the updated quiz
  const updatedQuiz = await quiz.save();

  res.json({ message: `Quiz with ID ${id} updated`, quiz: updatedQuiz });
});

// @desc Delete a quiz by ID
// @route DELETE /quizzes/:id
// @access Private
const deleteQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const quiz = await Quiz.findById(id);
  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  await quiz.deleteOne();
  res.status(200).json({ message: `Quiz with ID ${id} deleted` });
});

module.exports = {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
};
