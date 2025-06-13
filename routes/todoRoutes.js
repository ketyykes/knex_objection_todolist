import express from "express";
const router = express.Router();
import * as todoController from "../controllers/todoController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
	validateTodoInput,
	validateTodoId,
	validateUpdateTodoInput,
} from "../middleware/validators.js";

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

export default router;
