import { Client } from "pg";

const client = new Client({
  connectionString: process.env.LUCID_POSTGRES_URL as string,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

export default client;
