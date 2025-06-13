import argon2 from "argon2";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * 認證服務層
 * 提供使用者註冊、登入等功能的商業邏輯
 */
class AuthService {
	/**
	 * 使用者註冊
	 * @param {string} username - 使用者名稱
	 * @param {string} password - 密碼
	 * @returns {Promise<{user: Object, token: string}>} 註冊結果
	 */
	async register(username, password) {
		try {
			// 密碼雜湊
			const hashedPassword = await argon2.hash(password);

			// 建立使用者
			const user = await User.query().insert({
				username,
				password: hashedPassword,
			});

			// 生成 JWT token
			const token = this.generateToken(user.id);

			return {
				user: this.sanitizeUser(user),
				token,
			};
		} catch (error) {
			if (error.code === "23505") {
				throw new Error("使用者名稱已存在，請選擇其他名稱");
			}
			throw new Error(`註冊失敗：${error.message}`);
		}
	}

	/**
	 * 使用者登入
	 * @param {string} username - 使用者名稱
	 * @param {string} password - 密碼
	 * @returns {Promise<{user: Object, token: string}>} 登入結果
	 */
	async login(username, password) {
		try {
			// 查找使用者
			const user = await User.query().findOne({ username });
			if (!user) {
				throw new Error("用戶名或密碼錯誤");
			}

			// 驗證密碼
			const isValidPassword = await argon2.verify(user.password, password);
			if (!isValidPassword) {
				throw new Error("用戶名或密碼錯誤");
			}

			// 生成 JWT token
			const token = this.generateToken(user.id);

			return {
				user: this.sanitizeUser(user),
				token,
			};
		} catch (error) {
			throw new Error(`登入失敗：${error.message}`);
		}
	}

	/**
	 * 驗證 JWT token
	 * @param {string} token - JWT token
	 * @returns {Promise<Object>} 解碼的 token 資料
	 */
	async verifyToken(token) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			return decoded;
		} catch (error) {
			throw new Error("無效的 token");
		}
	}

	/**
	 * 根據使用者 ID 取得使用者資訊
	 * @param {number} userId - 使用者 ID
	 * @returns {Promise<Object>} 使用者資訊
	 */
	async getUserById(userId) {
		try {
			const user = await User.query().findById(userId);
			if (!user) {
				throw new Error("找不到使用者");
			}
			return this.sanitizeUser(user);
		} catch (error) {
			throw new Error(`取得使用者資訊失敗：${error.message}`);
		}
	}

	/**
	 * 生成 JWT token
	 * @param {number} userId - 使用者 ID
	 * @returns {string} JWT token
	 */
	generateToken(userId) {
		return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});
	}

	/**
	 * 清理使用者資料，移除敏感資訊
	 * @param {Object} user - 原始使用者資料
	 * @returns {Object} 清理後的使用者資料
	 */
	sanitizeUser(user) {
		const { password, ...sanitizedUser } = user;
		return sanitizedUser;
	}
}

// 匯出單例實例
export default new AuthService();
