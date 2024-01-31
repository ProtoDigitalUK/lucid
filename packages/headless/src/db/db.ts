import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import getConfig from "../services/config.js";

const config = await getConfig();

const client = postgres(config.databaseURL);
const db = drizzle(client, { schema });

export default db;
