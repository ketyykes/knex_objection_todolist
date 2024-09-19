const Todo = require("../models/Todo");

exports.createTodo = async (req, res) => {
	try {
		const { title } = req.body;
		const todo = await Todo.query().insert({ title, user_id: req.user.id });
		res.status(201).json(todo);
	} catch (error) {
		res.status(500).json({ message: "創建待辦事項失敗", error: error.message });
	}
};

exports.getTodos = async (req, res) => {
	try {
		const todos = await Todo.query().where("user_id", req.user.id);
		res.json(todos);
	} catch (error) {
		res.status(500).json({ message: "獲取待辦事項失敗", error: error.message });
	}
};

// 實現更新和刪除待辦事項的方法
exports.updateTodo = async (req, res) => {
	try {
		const { id } = req.params;
		const { title, completed } = req.body;
		await Todo.query().findById(id).update({ title, completed });
		res.json({ message: "待辦事項更新成功" });
	} catch (error) {
		res.status(500).json({ message: "更新待辦事項失敗", error: error.message });
	}
};

exports.deleteTodo = async (req, res) => {
	try {
		const { id } = req.params;
		await Todo.query().findById(id).delete();
		res.json({ message: "待辦事項刪除成功" });
	} catch (error) {
		res.status(500).json({ message: "刪除待辦事項失敗", error: error.message });
	}
};
