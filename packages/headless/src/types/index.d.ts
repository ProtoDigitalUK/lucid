import { type FastifyInstance } from "fastify";
import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../db/schema.js";

declare module "fastify" {
	interface FastifyInstance {
		db: PostgresJsDatabase<typeof schema>;
	}
}
