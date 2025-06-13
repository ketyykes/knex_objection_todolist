import { gql } from "graphql-tag";
import userTypeDefs from "./user.js";
import todoTypeDefs from "./todo.js";

// 基本的 Query 和 Mutation 型別
const baseTypeDefs = gql`
	type Query {
		_empty: String
	}

	type Mutation {
		_empty: String
	}
`;

// 匯總所有型別定義
const typeDefs = [baseTypeDefs, userTypeDefs, todoTypeDefs];

export default typeDefs;
