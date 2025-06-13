import todoService from "../../services/todoService.js";

/**
 * User 欄位 resolvers
 * 處理 User 型別中的關聯欄位
 */
const User = {
	/**
	 * 取得使用者的所有待辦事項
	 * @param {Object} parent - 使用者物件
	 * @param {Object} args - GraphQL 參數
	 * @param {Object} context - GraphQL 上下文
	 */
	async todos(parent, args, context) {
		try {
			// parent 就是 User 物件，包含 id 等資訊
			const todos = await todoService.getUserTodos(parent.id);
			return todos;
		} catch (error) {
			throw new Error(`取得使用者待辦事項失敗：${error.message}`);
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

export default User;
