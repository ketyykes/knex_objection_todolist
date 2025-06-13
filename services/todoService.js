import Todo from "../models/Todo.js";

/**
 * 待辦事項服務層
 * 提供待辦事項 CRUD 操作的商業邏輯
 */
class TodoService {
	/**
	 * 建立待辦事項
	 * @param {number} userId - 使用者 ID
	 * @param {string} title - 待辦事項標題
	 * @returns {Promise<Object>} 建立的待辦事項
	 */
	async createTodo(userId, title) {
		try {
			const todo = await Todo.query().insert({
				title,
				user_id: userId,
			});
			return todo;
		} catch (error) {
			if (error.code === "23505") {
				throw new Error("相同標題的待辦事項已存在");
			}
			throw new Error(`建立待辦事項失敗：${error.message}`);
		}
	}

	/**
	 * 取得使用者的所有待辦事項
	 * @param {number} userId - 使用者 ID
	 * @returns {Promise<Array>} 待辦事項清單
	 */
	async getUserTodos(userId) {
		try {
			const todos = await Todo.query().where("user_id", userId);
			return todos;
		} catch (error) {
			throw new Error(`取得待辦事項失敗：${error.message}`);
		}
	}

	/**
	 * 根據 ID 取得待辦事項
	 * @param {number} todoId - 待辦事項 ID
	 * @param {number} userId - 使用者 ID (用於權限檢查)
	 * @returns {Promise<Object>} 待辦事項
	 */
	async getTodoById(todoId, userId) {
		try {
			const todo = await Todo.query()
				.findById(todoId)
				.where("user_id", userId)
				.first();

			if (!todo) {
				throw new Error("找不到指定的待辦事項");
			}

			return todo;
		} catch (error) {
			throw new Error(`取得待辦事項失敗：${error.message}`);
		}
	}

	/**
	 * 更新待辦事項
	 * @param {number} todoId - 待辦事項 ID
	 * @param {number} userId - 使用者 ID
	 * @param {Object} updateData - 要更新的資料
	 * @returns {Promise<Object>} 更新後的待辦事項
	 */
	async updateTodo(todoId, userId, updateData) {
		try {
			// 先檢查待辦事項是否存在，且屬於當前使用者
			const todo = await Todo.query()
				.findById(todoId)
				.where("user_id", userId)
				.first();

			if (!todo) {
				throw new Error("找不到指定的待辦事項");
			}

			// 準備更新的欄位 (只更新提供的欄位)
			const fieldsToUpdate = {};
			if (updateData.title !== undefined)
				fieldsToUpdate.title = updateData.title;
			if (updateData.completed !== undefined)
				fieldsToUpdate.completed = updateData.completed;

			// 如果沒有要更新的欄位，直接返回原資料
			if (Object.keys(fieldsToUpdate).length === 0) {
				return todo;
			}

			// 更新待辦事項
			const updatedCount = await Todo.query()
				.findById(todoId)
				.patch(fieldsToUpdate);

			if (updatedCount === 0) {
				throw new Error("更新待辦事項失敗");
			}

			// 取得更新後的待辦事項
			const updatedTodo = await Todo.query().findById(todoId);
			return updatedTodo;
		} catch (error) {
			if (error.code === "23505") {
				throw new Error("相同標題的待辦事項已存在");
			}
			throw new Error(`更新待辦事項失敗：${error.message}`);
		}
	}

	/**
	 * 刪除待辦事項
	 * @param {number} todoId - 待辦事項 ID
	 * @param {number} userId - 使用者 ID
	 * @returns {Promise<boolean>} 刪除成功返回 true
	 */
	async deleteTodo(todoId, userId) {
		try {
			// 先檢查待辦事項是否存在，且屬於當前使用者
			const todo = await Todo.query()
				.findById(todoId)
				.where("user_id", userId)
				.first();

			if (!todo) {
				throw new Error("找不到指定的待辦事項");
			}

			// 刪除待辦事項
			const deletedCount = await Todo.query().deleteById(todoId);

			if (deletedCount === 0) {
				throw new Error("刪除待辦事項失敗");
			}

			return true;
		} catch (error) {
			throw new Error(`刪除待辦事項失敗：${error.message}`);
		}
	}

	/**
	 * 取得使用者的待辦事項統計
	 * @param {number} userId - 使用者 ID
	 * @returns {Promise<Object>} 統計資料
	 */
	async getTodoStats(userId) {
		try {
			const todos = await this.getUserTodos(userId);
			const total = todos.length;
			const completed = todos.filter((todo) => todo.completed).length;
			const pending = total - completed;

			return {
				total,
				completed,
				pending,
			};
		} catch (error) {
			throw new Error(`取得統計資料失敗：${error.message}`);
		}
	}
}

// 匯出單例實例
export default new TodoService();
