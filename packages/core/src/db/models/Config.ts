/*
  Unique case for now where model also contains validation, normally this would be handled in a middleware or controller
*/

import fs from "fs-extra";
import path from "path";
import z from "zod";

// -------------------------------------------
// Config
const configSchema = z.object({
  port: z.number(),
  database_url: z.string(),
  origin: z.string().optional(),
});

export type ConfigT = z.infer<typeof configSchema>;

export default class Config {
  // -------------------------------------------
  // Public
  static validate = async (config: ConfigT) => {
    await configSchema.parseAsync(config);
  };
  static set = async (config: ConfigT) => {
    await fs.ensureDir(path.join(__dirname, "../../temp"));
    await fs.writeFile(
      path.join(__dirname, "../../temp/config.json"),
      JSON.stringify(config, null, 2)
    );
  };
  static get = () => {
    const config = fs.readFileSync(
      path.join(__dirname, "../../../temp/config.json"),
      "utf-8"
    );
    return JSON.parse(config) as ConfigT;
  };
  // getters
  static get database_url() {
    return Config.get().database_url;
  }
  // -------------------------------------------
  // Util Methods
}
