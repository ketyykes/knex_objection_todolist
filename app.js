import "dotenv/config";
import express from "express";
import { Model } from "objection";
import Knex from "knex";
import knexConfig from "./knexfile.js";

import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import { createApolloServer, getGraphQLMiddleware } from "./graphql/server.js";

const app = express();
const knex = Knex(knexConfig);

Model.knex(knex);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

app.get("/", (req, res) => {
	res.send("Hello World");
});

// 健康檢查端點
app.get("/health", (req, res) => {
	res.status(200).json({ status: "healthy" });
});

const port = process.env.PORT || 3000;

// 初始化並啟動伺服器
const startServer = async () => {
	try {
		// 測試資料庫連接
		await knex.raw("SELECT 1");
		console.log("資料庫連接成功");

		// 建立 Apollo GraphQL 伺服器
		const apolloServer = await createApolloServer();

		// 設定 GraphQL 端點
		app.use("/graphql", getGraphQLMiddleware(apolloServer));

		// 啟動 Express 伺服器
		app.listen(port, () => {
			console.log(`伺服器運行在 http://localhost:${port}`);
			console.log(`GraphQL Playground: http://localhost:${port}/graphql`);
		});
	} catch (err) {
		console.error("伺服器啟動失敗：", err);
		process.exit(1);
	}
};

startServer();
