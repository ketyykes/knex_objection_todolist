const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/", todoController.createTodo);
router.get("/", todoController.getTodos);
router.put("/:id", todoController.updateTodo);
router.delete("/:id", todoController.deleteTodo);

module.exports = router;
