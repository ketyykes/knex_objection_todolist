import authService from "../../services/authService.js";

/**
 * Todo 欄位 resolvers
 * 處理 Todo 型別中的關聯欄位
 */
const Todo = {
	/**
	 * 取得待辦事項所屬的使用者
	 * @param {Object} parent - 待辦事項物件
	 * @param {Object} args - GraphQL 參數
	 * @param {Object} context - GraphQL 上下文
	 */
	async user(parent, args, context) {
		try {
			// parent 是 Todo 物件，包含 user_id 欄位
			const user = await authService.getUserById(parent.user_id);
			return user;
		} catch (error) {
			throw new Error(`取得待辦事項使用者失敗：${error.message}`);
		}
	},

	/**
	 * 格式化時間欄位
	 */
	createdAt(parent) {
		return parent.created_at ? parent.created_at.toISOString() : null;
	},

	updatedAt(parent) {
		return parent.updated_at ? parent.updated_at.toISOString() : null;
	},
};

export default Todo;
