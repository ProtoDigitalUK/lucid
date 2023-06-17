import { type Config } from "@lucid/core";
import { banner, intro, defaultMeta } from "./src/bricks";
import { pages, settings } from "./src/collections";

const config: Config = {
  databaseUrl: process.env.LUCID_database_url as string,
  port: 8393,
  origin: "*",
  mode: "development",
  secretKey: process.env.SECRET_KEY as string,
  environments: [
    {
      title: "Production",
      key: "production",
    },
    {
      title: "Staging",
      key: "staging",
    },
  ],
  collections: [pages, settings],
  bricks: [banner, intro, defaultMeta],
};

export default config;
