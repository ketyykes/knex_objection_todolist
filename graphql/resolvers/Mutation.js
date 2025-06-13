import authService from "../../services/authService.js";

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

	// TODO: 在後續階段會新增待辦事項相關的 mutations
	// createTodo, updateTodo, deleteTodo
};

export default Mutation;
