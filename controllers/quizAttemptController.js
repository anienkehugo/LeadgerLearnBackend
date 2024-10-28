const QuizAttempt = require("../models/QuizAttempt");
const asyncHandler = require("express-async-handler");

// @desc Check if a quiz attempt exists for a user
// @route GET /quiz-attempts/:quizId/:userId
// @access Private
const checkQuizAttempt = asyncHandler(async (req, res) => {
  try {
    // Get all quiz attempts from MongoDB
    const quizAttempts = await QuizAttempt.find().lean();

    // If no quiz attempts found
    // if (!quizAttempts.length) {
    //   return res.status(404).json({ message: "No quiz attempts found" });
    // }

    // Respond with the quiz attempts
    res.json(quizAttempts);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving quiz attempts" });
  }
});

// @desc Create a new quiz attempt
// @route POST /quiz-attempts
// @access Private
const createQuizAttempt = asyncHandler(async (req, res) => {
  const { userId, quizId, answers, score, dateAttempted } = req.body;

  // Validate input
  if (!quizId || !answers || typeof score !== "number") {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if this user has already attempted the quiz
  const existingAttempt = await QuizAttempt.findOne({
    user: userId,
    quiz: quizId,
  });
  if (existingAttempt) {
    return res
      .status(400)
      .json({ message: "Quiz already attempted by this user" });
  }

  // Create and save new quiz attempt
  const newQuizAttempt = new QuizAttempt({
    user: userId,
    quiz: quizId,
    answers,
    score,
    dateAttempted,
  });

  const savedAttempt = await newQuizAttempt.save();
  res.status(201).json({
    message: "Quiz attempt successfully created",
    attempt: savedAttempt,
  });
});

// @desc Update a quiz attempt
// @route PATCH /quiz-attempts/:quizId/:userId
// @access Private
const updateQuizAttempt = asyncHandler(async (req, res) => {
  const { quizId, userId } = req.params;
  const { answers, score } = req.body;

  // Validate input
  if (!answers || typeof score !== "number") {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find and update the quiz attempt
  const updatedQuizAttempt = await QuizAttempt.findOneAndUpdate(
    { user: userId, quiz: quizId },
    { answers, score },
    { new: true } // Returns the updated document
  );

  if (!updatedQuizAttempt) {
    return res.status(404).json({ message: "Quiz attempt not found" });
  }

  res
    .status(200)
    .json({ message: "Quiz attempt updated", attempt: updatedQuizAttempt });
});

// @desc Delete a quiz attempt
// @route DELETE /quiz-attempts/:quizId/:userId
// @access Private
// const deleteQuizAttempt = asyncHandler(async (req, res) => {
//   const { quizId, userId } = req.params;

//   // Find and delete the quiz attempt
//   const deletedQuizAttempt = await QuizAttempt.findOneAndDelete({
//     user: userId,
//     quiz: quizId,
//   });

//   if (!deletedQuizAttempt) {
//     return res.status(404).json({ message: "Quiz attempt not found" });
//   }

//   res.status(200).json({ message: "Quiz attempt deleted" });
// });
const deleteQuizAttempt = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Find and delete the quiz attempt by its _id
  const deletedQuizAttempt = await QuizAttempt.findById(id);

  if (!deletedQuizAttempt) {
    return res.status(404).json({ message: "Quiz attempt not found" });
  }

  const result = await deletedQuizAttempt.deleteOne();

  res.status(200).json({ message: "Quiz attempt deleted" });
});

module.exports = {
  checkQuizAttempt,
  createQuizAttempt,
  updateQuizAttempt,
  deleteQuizAttempt,
};
