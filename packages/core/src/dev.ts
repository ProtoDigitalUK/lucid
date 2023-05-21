import lucid from "./index";

export const config = {
  port: 8393,
  origin: "*",
  environment: "development" as "development" | "production",
  secret_key: "f3b2e4b00b1a4b1e9b0a8b0a9b1e0b1a",
};

lucid.start(config);
