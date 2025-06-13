import Query from "./Query.js";
import Mutation from "./Mutation.js";
import User from "./User.js";
import Todo from "./Todo.js";

/**
 * GraphQL Resolvers 匯總
 * 將所有解析器組合成一個物件
 */
const resolvers = {
	Query,
	Mutation,
	User,
	Todo,
};

export default resolvers;
