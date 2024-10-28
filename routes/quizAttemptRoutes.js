const express = require("express");
const router = express.Router();
const quizAttemptController = require("../controllers/quizAttemptController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

// Route for checking if a quiz attempt exists (GET request with query params)
router.get("/", quizAttemptController.checkQuizAttempt);

// Route for creating a quiz attempt (POST)
router.post("/", quizAttemptController.createQuizAttempt);

// Route for updating a quiz attempt (PATCH)
router.patch("/", quizAttemptController.updateQuizAttempt);

// Route for deleting a quiz attempt (DELETE)
router.delete("/", quizAttemptController.deleteQuizAttempt);

module.exports = router;
