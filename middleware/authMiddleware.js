const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	const token = req.header("Authorization")?.replace("Bearer ", "");
	if (!token) {
		return res.status(401).json({ message: "未提供認證令牌" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = { id: decoded.id };
		next();
	} catch (error) {
		res.status(401).json({ message: "無效的認證令牌" });
	}
};
