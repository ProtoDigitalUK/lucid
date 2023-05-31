import { type Config } from "@lucid/core";
import { bannerBrick, introBrick } from "./src/bricks";

const config: Config = {
  databaseUrl: process.env.LUCID_database_url as string,
  port: 8393,
  origin: "*",
  environment: "development",
  secretKey: "f3b2e4b00b1a4b1e9b0a8b0a9b1e0b1a",
  postTypes: [
    {
      key: "blog",
      name: "Blogs",
      singularName: "Blog",
    },
  ],
  bricks: [bannerBrick, introBrick],
};

export default config;
