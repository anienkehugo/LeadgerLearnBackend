const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);
router
  .route("/")
  .get(quizController.getAllQuizzes)
  .get(quizController.getQuizById)
  .patch(quizController.updateQuiz)
  .post(quizController.createQuiz)
  .delete(quizController.deleteQuiz);

module.exports = router;
