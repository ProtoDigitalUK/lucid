import { Client } from "pg";
// Services
import Config from "@services/Config";

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
