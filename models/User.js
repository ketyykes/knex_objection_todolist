import { Model } from "objection";
import Todo from "./Todo.js";

class User extends Model {
	static get tableName() {
		return "users";
	}

	static get relationMappings() {
		return {
			todos: {
				relation: Model.HasManyRelation,
				modelClass: Todo,
				join: {
					from: "users.id",
					to: "todos.user_id",
				},
			},
		};
	}
}

export default User;
