import authService from "../../services/authService.js";
import todoService from "../../services/todoService.js";
import { requireAuth } from "../context.js";

/**
 * Mutation resolvers
 * 處理所有的 GraphQL mutations
 */
const Mutation = {
	/**
	 * 使用者註冊
	 * @param {*} parent - 父級解析器結果
	 * @param {Object} args - GraphQL 參數
	 * @param {Object} context - GraphQL 上下文
	 */
	async register(parent, { input }, context) {
		try {
			const { username, password } = input;

			// 驗證輸入
			if (!username || username.trim().length === 0) {
				throw new Error("使用者名稱不能為空");
			}
			if (!password || password.length < 6) {
				throw new Error("密碼長度至少需要 6 個字元");
			}

			// 調用服務層註冊使用者
			const result = await authService.register(username.trim(), password);

			return {
				token: result.token,
				user: result.user,
			};
		} catch (error) {
			throw new Error(error.message);
		}
	},

	/**
	 * 使用者登入
	 * @param {*} parent - 父級解析器結果
	 * @param {Object} args - GraphQL 參數
	 * @param {Object} context - GraphQL 上下文
	 */
	async login(parent, { input }, context) {
		try {
			const { username, password } = input;

			// 驗證輸入
			if (!username || username.trim().length === 0) {
				throw new Error("請提供使用者名稱");
			}
			if (!password || password.length === 0) {
				throw new Error("請提供密碼");
			}

			// 調用服務層登入使用者
			const result = await authService.login(username.trim(), password);

			return {
				token: result.token,
				user: result.user,
			};
		} catch (error) {
			throw new Error(error.message);
		}
	},

	/**
	 * 建立新的待辦事項
	 */
	async createTodo(parent, { input }, context) {
		const user = requireAuth(context.user);

		try {
			const { title } = input;

			if (!title || title.trim().length === 0) {
				throw new Error("待辦事項標題不能為空");
			}

			const todo = await todoService.createTodo(user.id, title.trim());
			return todo;
		} catch (error) {
			throw new Error(`建立待辦事項失敗：${error.message}`);
		}
	},

	/**
	 * 更新待辦事項
	 */
	async updateTodo(parent, { id, input }, context) {
		const user = requireAuth(context.user);

		try {
			const todoId = parseInt(id);
			if (isNaN(todoId) || todoId <= 0) {
				throw new Error("無效的待辦事項 ID");
			}

			const todo = await todoService.updateTodo(todoId, user.id, input);
			return todo;
		} catch (error) {
			throw new Error(`更新待辦事項失敗：${error.message}`);
		}
	},

	/**
	 * 刪除待辦事項
	 */
	async deleteTodo(parent, { id }, context) {
		const user = requireAuth(context.user);

		try {
			const todoId = parseInt(id);
			if (isNaN(todoId) || todoId <= 0) {
				throw new Error("無效的待辦事項 ID");
			}

			const deleted = await todoService.deleteTodo(todoId, user.id);
			return deleted;
		} catch (error) {
			throw new Error(`刪除待辦事項失敗：${error.message}`);
		}
	},
};

export default Mutation;
