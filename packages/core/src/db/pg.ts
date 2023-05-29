import { Client } from "pg";
import Config from "./models/Config";

const client = new Client({
  connectionString: Config.connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

export default client;
