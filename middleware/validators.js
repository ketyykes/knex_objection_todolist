// 標題驗證的通用函數
const validateTitle = (title) => {
	const errors = [];

	// 檢查 title 是否為空
	if (title === "" || title === null) {
		errors.push("標題不能為空");
		return errors;
	}

	// 檢查 title 是否為字串
	if (typeof title !== "string") {
		errors.push("標題必須是字串");
		return errors;
	}

	// 檢查 title 長度
	if (title.trim().length > 100) {
		errors.push("標題不能超過 100 個字符");
	}

	// 檢查惡意內容
	const maliciousPatterns = [
		/<script>/i,
		/javascript:/i,
		/onerror=/i,
		/onclick=/i,
	];
	if (maliciousPatterns.some((pattern) => pattern.test(title))) {
		errors.push("標題包含禁止使用的內容");
	}

	return errors;
};

const validateTodoInput = (req, res, next) => {
	const { title } = req.body;

	// 檢查 title 是否缺漏
	if (!title) {
		return res.status(400).json({ message: "標題不能為空" });
	}

	// 驗證標題
	const titleErrors = validateTitle(title);
	if (titleErrors.length > 0) {
		return res.status(400).json({ message: titleErrors[0] });
	}

	// 清理數據 - 去除前後空白
	req.body.title = title.trim();

	next();
};

// 檢查請求參數 ID 是否有效
const validateTodoId = (req, res, next) => {
	const { id } = req.params;

	// 檢查 ID 是否存在
	if (!id) {
		return res.status(400).json({ message: "缺少待辦事項 ID" });
	}

	// 檢查 ID 格式是否正確 (假設使用數字 ID)
	if (!/^\d+$/.test(id)) {
		return res.status(400).json({ message: "待辦事項 ID 格式不正確" });
	}

	next();
};

// 驗證更新待辦事項的輸入
const validateUpdateTodoInput = (req, res, next) => {
	const { title, completed } = req.body;

	// 檢查是否至少有一個欄位要更新
	if (title === undefined && completed === undefined) {
		return res.status(400).json({ message: "至少需要一個欄位進行更新" });
	}

	// 如果有提供 title，則驗證 title
	if (title !== undefined) {
		const titleErrors = validateTitle(title);
		if (titleErrors.length > 0) {
			return res.status(400).json({ message: titleErrors[0] });
		}

		// 清理數據 - 去除前後空白
		req.body.title = title.trim();
	}

	// 如果有提供 completed，則驗證 completed
	if (completed !== undefined) {
		// 檢查 completed 是否為布爾值
		if (typeof completed !== "boolean") {
			return res.status(400).json({ message: "完成狀態必須是布爾值" });
		}
	}

	next();
};

module.exports = {
	validateTodoInput,
	validateTodoId,
	validateUpdateTodoInput,
};
