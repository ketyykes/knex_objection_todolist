import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * GraphQL 上下文函式
 * 負責解析 JWT token 並提供使用者資訊
 */
export const createContext = async ({ req }) => {
	let user = null;

	try {
		// 從 Authorization header 取得 token
		const authHeader = req.headers.authorization;
		if (authHeader && authHeader.startsWith("Bearer ")) {
			const token = authHeader.substring(7); // 移除 "Bearer " 前綴

			// 驗證 JWT token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// 從資料庫取得使用者資訊
			user = await User.query().findById(decoded.id);
		}
	} catch (error) {
		// token 無效或過期，user 保持 null
		console.log("GraphQL 認證錯誤：", error.message);
	}

	return {
		user, // 當前認證的使用者 (null 表示未認證)
	};
};

/**
 * 檢查使用者是否已認證的輔助函式
 */
export const requireAuth = (user) => {
	if (!user) {
		throw new Error("需要認證才能執行此操作");
	}
	return user;
};
