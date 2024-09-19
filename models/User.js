const { Model } = require("objection");

class User extends Model {
	static get tableName() {
		return "users";
	}

	static get relationMappings() {
		const Todo = require("./Todo");
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

module.exports = User;
