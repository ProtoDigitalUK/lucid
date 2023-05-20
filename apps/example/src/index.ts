import lucid from "@lucid/core";

lucid.start({
  port: 8393,
  origin: "*",
  database_url: process.env.DATABASE_URL as string,
});
