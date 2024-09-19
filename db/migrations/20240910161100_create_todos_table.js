/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("todos", (table) => {
		table.increments("id").primary();
		table.string("title").notNullable();
		table.boolean("completed").defaultTo(false);
		table.integer("user_id").unsigned().notNullable();
		table.foreign("user_id").references("users.id").onDelete("CASCADE");
		table.timestamps(true, true);
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTable("todos");
};
