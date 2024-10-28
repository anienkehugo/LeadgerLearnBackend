const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Quiz",
  },
  answers: [
    {
      questionId: mongoose.Schema.Types.ObjectId, // Reference to a specific question
      amount: String,
      debit: String, // User's answer for debit, can be empty if not applicable
      credit: String, // User's answer for credit, can be empty if not applicable
      description: String, // User's answer for description, can be empty if not applicable
    },
  ],
  score: {
    type: Number,
    required: true,
  },
  dateAttempted: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
