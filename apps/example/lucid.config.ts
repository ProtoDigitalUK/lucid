import { type Config } from "@lucid/core";
import { banner, intro, defaultMeta } from "./src/bricks";
import { pages, settings } from "./src/collections";

const config: Config = {
  databaseUrl: process.env.LUCID_database_url as string,
  port: 8393,
  origin: "*",
  environment: "development",
  secretKey: process.env.SECRET_KEY as string,
  collections: [pages, settings],
  bricks: [banner, intro, defaultMeta],
};

export default config;
