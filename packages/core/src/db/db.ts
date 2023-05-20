import postgres from "postgres";
import Config from "@utils/config";

const sql = postgres(Config.database_url, {
  ssl: {
    rejectUnauthorized: false,
  },
});

export default sql;
