import headlessCore from "headless-core";

headlessCore.start({
  port: 8393,
  origin: "*",
  database_url: process.env.DATABASE_URL as string,
});
