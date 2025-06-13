import { requireAuth } from "../context.js";
import authService from "../../services/authService.js";
import todoService from "../../services/todoService.js";

/**
 * Query resolvers
 * 處理所有的 GraphQL queries
 */
const Query = {
	/**
	 * 取得當前認證使用者的資訊
	 * @param {*} parent - 父級解析器結果
	 * @param {Object} args - GraphQL 參數
	 * @param {Object} context - GraphQL 上下文
	 */
	async me(parent, args, context) {
		// 檢查使用者是否已認證
		const user = requireAuth(context.user);

		try {
			// 從服務層取得使用者完整資訊
			const userInfo = await authService.getUserById(user.id);
			return userInfo;
		} catch (error) {
			throw new Error(`取得使用者資訊失敗：${error.message}`);
		}
	},

	/**
	 * 取得使用者的所有待辦事項
	 * @param {*} parent - 父級解析器結果
	 * @param {Object} args - GraphQL 參數
	 * @param {Object} context - GraphQL 上下文
	 */
	async todos(parent, args, context) {
		// 檢查使用者是否已認證
		const user = requireAuth(context.user);

		try {
			// 從服務層取得使用者的所有待辦事項
			const todos = await todoService.getUserTodos(user.id);
			return todos;
		} catch (error) {
			throw new Error(`取得待辦事項失敗：${error.message}`);
		}
	},

	/**
	 * 根據 ID 取得特定待辦事項
	 * @param {*} parent - 父級解析器結果
	 * @param {Object} args - GraphQL 參數 (包含 id)
	 * @param {Object} context - GraphQL 上下文
	 */
	async todo(parent, { id }, context) {
		// 檢查使用者是否已認證
		const user = requireAuth(context.user);

		try {
			// 驗證 ID 格式
			const todoId = parseInt(id);
			if (isNaN(todoId) || todoId <= 0) {
				throw new Error("無效的待辦事項 ID");
			}

			// 從服務層取得特定待辦事項 (包含權限檢查)
			const todo = await todoService.getTodoById(todoId, user.id);
			return todo;
		} catch (error) {
			throw new Error(`取得待辦事項失敗：${error.message}`);
		}
	},
};

export default Query;
