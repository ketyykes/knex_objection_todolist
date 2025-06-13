import { gql } from "graphql-tag";

const todoTypeDefs = gql`
	# 待辦事項型別
	type Todo {
		id: ID!
		title: String!
		completed: Boolean!
		user: User!
		createdAt: String!
		updatedAt: String!
	}

	# 建立待辦事項輸入型別
	input CreateTodoInput {
		title: String!
	}

	# 更新待辦事項輸入型別
	input UpdateTodoInput {
		title: String
		completed: Boolean
	}

	extend type Query {
		# 取得使用者的所有待辦事項
		todos: [Todo!]!

		# 根據 ID 取得特定待辦事項
		todo(id: ID!): Todo
	}

	extend type Mutation {
		# 待辦事項操作
		createTodo(input: CreateTodoInput!): Todo!
		updateTodo(id: ID!, input: UpdateTodoInput!): Todo!
		deleteTodo(id: ID!): Boolean!
	}
`;

export default todoTypeDefs;
