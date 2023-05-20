import lucid from "./index";

export const config = {
  port: 8393,
  origin: "*",
  database_url: process.env.DATABASE_URL as string,
};

lucid.start(config);
