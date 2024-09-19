const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
	try {
		const { username, password } = req.body;
		const hashedPassword = bcrypt.hashSync(password, 10);
		const user = await User.query().insert({
			username,
			password: hashedPassword,
		});
		res.status(201).json({ message: "用戶註冊成功" });
	} catch (error) {
		res.status(500).json({ message: "註冊失敗", error: error.message });
	}
};

exports.login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.query().findOne({ username });
		if (!user) {
			return res.status(401).json({ message: "用戶名或密碼錯誤" });
		}
		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			return res.status(401).json({ message: "用戶名或密碼錯誤" });
		}
		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});
		res.json({ token });
	} catch (error) {
		res.status(500).json({ message: "登入失敗", error: error.message });
	}
};
