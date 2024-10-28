const mongoose = require("mongoose");
// Schema for individual questions
const questionSchema = new mongoose.Schema({
  amount: { type: String }, // Optional field
  debit: { type: String },
  credit: { type: String },
  date: { type: String }, // Optional field
  description: { type: String, required: true },
  explanation: { type: String, required: true },
});

// Main quiz schema
const quizSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title of the quiz
  questions: [questionSchema], // Array of questions based on questionSchema
});

// Export the model
module.exports = mongoose.model("Quiz", quizSchema);
