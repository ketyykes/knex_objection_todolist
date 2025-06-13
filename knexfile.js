import "dotenv/config";

export default {
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
