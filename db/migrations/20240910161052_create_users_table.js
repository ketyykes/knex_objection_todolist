/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
	return knex.schema.createTable("users", (table) => {
		table.increments("id").primary();
		table.string("username").notNullable().unique();
		table.string("password").notNullable();
		table.timestamps(true, true);
	});
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
	return knex.schema.dropTable("users");
}
