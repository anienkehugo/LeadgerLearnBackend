const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: [
    {
      type: String,
      default: "Student",
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  quizzesCompleted: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizAttempt",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
