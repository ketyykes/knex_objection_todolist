import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import typeDefs from "./typeDefs/index.js";
import resolvers from "./resolvers/index.js";
import { createContext } from "./context.js";

/**
 * 建立並設定 Apollo Server
 */
export const createApolloServer = async () => {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		// 在開發環境中啟用 introspection 和 playground
		introspection: process.env.NODE_ENV !== "production",
		// 格式化錯誤訊息
		formatError: (error) => {
			console.error("GraphQL Error:", error);

			// 在生產環境中隱藏敏感錯誤詳情
			if (process.env.NODE_ENV === "production") {
				// 移除堆疊追蹤和其他敏感資訊
				return {
					message: error.message,
					code: error.extensions?.code,
				};
			}

			return error;
		},
	});

	await server.start();

	return server;
};

/**
 * 取得 GraphQL 中間件
 */
export const getGraphQLMiddleware = (server) => {
	return expressMiddleware(server, {
		context: createContext,
	});
};
