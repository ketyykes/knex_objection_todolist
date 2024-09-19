require("dotenv").config();

module.exports = {
	client: "pg",
	connection: process.env.DATABASE_URL,
	migrations: {
		directory: "./db/migrations",
		loadExtensions: [".js"],
	},
	seeds: {
		directory: "./db/seeds",
	},
};
