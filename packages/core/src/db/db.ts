import postgres from "postgres";
import Config from "@db/models/Config";

const sql = postgres(Config.database_url, {
  ssl: {
    rejectUnauthorized: false,
  },
});

export default sql;
