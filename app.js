require("dotenv").config();
const express = require("express");
const { Model } = require("objection");
const Knex = require("knex");
const knexConfig = require("./knexfile");

const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");

const app = express();
const knex = Knex(knexConfig);

Model.knex(knex);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

const PORT = process.env.PORT || 3000;

// 測試資料庫連接
knex
	.raw("SELECT 1")
	.then(() => {
		console.log("資料庫連接成功");
		app.listen(PORT, () => console.log(`伺服器運行在端口 ${PORT}`));
	})
	.catch((err) => {
		console.error("資料庫連接失敗：", err);
		process.exit(1);
	});
