const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const authMiddleware = require("../middleware/authMiddleware");
const {
	validateTodoInput,
	validateTodoId,
	validateUpdateTodoInput,
} = require("../middleware/validators");

router.use(authMiddleware);

router.post("/", validateTodoInput, todoController.createTodo);
router.get("/", todoController.getTodos);
router.put(
	"/:id",
	validateTodoId,
	validateUpdateTodoInput,
	todoController.updateTodo
);
router.delete("/:id", validateTodoId, todoController.deleteTodo);

module.exports = router;
