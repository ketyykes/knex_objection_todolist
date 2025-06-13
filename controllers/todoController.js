import Todo from "../models/Todo.js";

export const createTodo = async (req, res) => {
	try {
		const { title } = req.body;
		const todo = await Todo.query().insert({ title, user_id: req.user.id });
		res.status(201).json(todo);
	} catch (error) {
		console.error("創建待辦事項時出錯：", error);

		// 處理特定數據庫錯誤
		if (error.code === "23505") {
			// PostgreSQL 唯一約束衝突
			return res.status(409).json({ message: "相同標題的待辦事項已存在" });
		}

		res.status(500).json({ message: "創建待辦事項失敗", error: error.message });
	}
};

export const getTodos = async (req, res) => {
	try {
		const todos = await Todo.query().where("user_id", req.user.id);
		res.json(todos);
	} catch (error) {
		res.status(500).json({ message: "獲取待辦事項失敗", error: error.message });
	}
};

// 實現更新和刪除待辦事項的方法
export const updateTodo = async (req, res) => {
	try {
		const { id } = req.params;
		const { title, completed } = req.body;

		// 先檢查待辦事項是否存在，且屬於當前用戶
		const todo = await Todo.query()
			.findById(id)
			.where("user_id", req.user.id)
			.first();

		// 如果找不到指定的待辦事項
		if (!todo) {
			return res.status(404).json({ message: "找不到指定的待辦事項" });
		}

		// 準備更新的欄位
		const updateData = {};
		if (title !== undefined) updateData.title = title;
		if (completed !== undefined) updateData.completed = completed;

		// 更新待辦事項
		const updatedCount = await Todo.query().findById(id).patch(updateData);

		// 檢查是否成功更新
		if (updatedCount === 0) {
			return res.status(500).json({ message: "更新待辦事項失敗" });
		}

		// 獲取更新後的待辦事項
		const updatedTodo = await Todo.query().findById(id);

		res.status(200).json({
			message: "待辦事項更新成功",
			todo: updatedTodo,
		});
	} catch (error) {
		console.error("更新待辦事項時出錯：", error);

		// 處理特定資料庫錯誤
		if (error.code === "23505") {
			// PostgreSQL 唯一約束衝突
			return res.status(409).json({ message: "相同標題的待辦事項已存在" });
		}

		res.status(500).json({ message: "更新待辦事項失敗", error: error.message });
	}
};

export const deleteTodo = async (req, res) => {
	try {
		const { id } = req.params;

		// 先檢查待辦事項是否存在，且屬於當前用戶
		const todo = await Todo.query()
			.findById(id)
			.where("user_id", req.user.id)
			.first();

		// 如果找不到指定的待辦事項
		if (!todo) {
			return res.status(404).json({ message: "找不到指定的待辦事項" });
		}

		// 刪除待辦事項
		const deletedCount = await Todo.query().deleteById(id);

		// 檢查是否成功刪除
		if (deletedCount === 0) {
			return res.status(500).json({ message: "刪除待辦事項失敗" });
		}

		res.status(200).json({ message: "待辦事項刪除成功" });
	} catch (error) {
		console.error("刪除待辦事項時出錯：", error);
		res.status(500).json({ message: "刪除待辦事項失敗", error: error.message });
	}
};
