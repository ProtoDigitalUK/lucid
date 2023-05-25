import fs from "fs-extra";
import path from "path";
import z from "zod";
import { Express } from "express";
import { RuntimeError } from "@utils/error-handler";
// Internal packages
import { BrickBuilderT } from "@lucid/brick-builder";

// -------------------------------------------
// Config
const configSchema = z.object({
  port: z.number(),
  origin: z.string().optional(),
  environment: z.enum(["development", "production"]),
  secret_key: z.string(),
  bricks: z.array(z.any()).optional(),
});

export type ConfigT = {
  port: number;
  origin?: string;
  environment: "development" | "production";
  secret_key: string;
  bricks?: BrickBuilderT[];
};

type ConfigValidate = (config: ConfigT) => Promise<void>;
type ConfigSet = (app: Express, config: ConfigT) => Promise<void>;
type ConfigGet = () => ConfigT;

export default class Config {
  // -------------------------------------------
  // Public
  static validate: ConfigValidate = async (config) => {
    // TODO: Format errors for better readability
    await configSchema.parseAsync(config);

    // Validate brick keys for duplicates, data is validated in BrickBuilder already
    if (!config.bricks) return;
    const brickKeys = config.bricks.map((brick) => brick.key);
    const uniqueBrickKeys = [...new Set(brickKeys)];
    if (brickKeys.length !== uniqueBrickKeys.length) {
      throw new RuntimeError("Brick keys must be unique");
    }
  };
  static set: ConfigSet = async (app, config) => {
    // set bricks in the app
    app.set("bricks", config.bricks);

    delete config.bricks;

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
