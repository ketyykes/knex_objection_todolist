import { gql } from "graphql-tag";

const userTypeDefs = gql`
	# 使用者型別
	type User {
		id: ID!
		username: String!
		todos: [Todo!]!
		createdAt: String!
		updatedAt: String!
	}

	# 認證回應型別
	type AuthPayload {
		token: String!
		user: User!
	}

	# 註冊輸入型別
	input RegisterInput {
		username: String!
		password: String!
	}

	# 登入輸入型別
	input LoginInput {
		username: String!
		password: String!
	}

	extend type Query {
		# 取得當前使用者資訊
		me: User
	}

	extend type Mutation {
		# 使用者認證
		register(input: RegisterInput!): AuthPayload!
		login(input: LoginInput!): AuthPayload!
	}
`;

export default userTypeDefs;
