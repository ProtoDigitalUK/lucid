import postgres from "postgres";
import Config from "@db/models/Config";

const sql = postgres(Config.databaseUrl, {
  ssl: {
    rejectUnauthorized: false,
  },
});

export default sql;
