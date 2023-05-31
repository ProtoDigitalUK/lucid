import { Client } from "pg";
import Config from "@services/Config";

const client = new Client({
  connectionString: Config.databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

export default client;
