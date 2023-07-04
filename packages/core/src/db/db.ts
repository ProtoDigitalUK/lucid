import { Client } from "pg";
import Config from "@db/models/Config";

const getDBClient = async () => {
  const config = await Config.getConfig();

  const client = new Client({
    connectionString: config.postgresURL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  return client.connect().then(() => client);
};

export default getDBClient();
