/*
  TODO: If this becomes a bottleneck, use hybrid approach where config is first looked up from app.get, 
  TODO: ...and if the app is not present, then read from file
  Unique case for now where model also contains validation, normally this would be handled in a middleware or controller
*/

import fs from "fs-extra";
import path from "path";
import z from "zod";

// -------------------------------------------
// Config
const configSchema = z.object({
  port: z.number(),
  origin: z.string().optional(),
  environment: z.enum(["development", "production"]),
  secret_key: z.string(),
});

export type ConfigT = z.infer<typeof configSchema>;

type ConfigValidate = (config: ConfigT) => Promise<void>;
type ConfigSet = (config: ConfigT) => Promise<void>;
type ConfigGet = () => ConfigT;

export default class Config {
  // -------------------------------------------
  // Public
  static validate: ConfigValidate = async (config) => {
    // TODO: Format errors for better readability
    await configSchema.parseAsync(config);
  };
  static set: ConfigSet = async (config) => {
    await fs.ensureDir(path.join(__dirname, "../../../temp"));

    await fs.writeFile(
      path.join(__dirname, "../../../temp/config.json"),
      JSON.stringify(config, null, 2)
    );
  };
  static get: ConfigGet = () => {
    const config = fs.readFileSync(
      path.join(__dirname, "../../../temp/config.json"),
      "utf-8"
    );
    return JSON.parse(config);
  };
  // getters
  static get secret_key() {
    return Config.get().secret_key;
  }
  static get environment() {
    return Config.get().environment;
  }
  static get database_url() {
    return process.env.LUCID_DATABASE_URL as string;
  }
  // -------------------------------------------
  // Util Methods
}
