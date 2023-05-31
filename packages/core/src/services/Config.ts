import fs from "fs-extra";
import path from "path";
import z from "zod";
import { RuntimeError } from "@utils/error-handler";
// Internal packages
import { BrickBuilderT } from "@lucid/brick-builder";

// -------------------------------------------
// Config
const configSchema = z.object({
  port: z.number(),
  origin: z.string().optional(),
  environment: z.enum(["development", "production"]),
  databaseUrl: z.string(),
  secretKey: z.string(),
  postTypes: z.array(
    z.object({
      key: z.string().refine((key) => key !== "page"),
      name: z.string().refine((name) => name !== "Pages"),
      singularName: z.string().refine((name) => name !== "Page"),
    })
  ),
  bricks: z.array(z.any()).optional(),
});

export type ConfigT = {
  port: number;
  origin?: string;
  environment: "development" | "production";
  databaseUrl: string;
  secretKey: string;
  postTypes: Array<{
    key: string;
    name: string;
    singularName: string;
  }>;
  bricks?: BrickBuilderT[];
};

export default class Config {
  // Cache for configuration
  private static _configCache: ConfigT | null = null;
  // -------------------------------------------
  // Public
  public static validate = (): void => {
    const config = Config.get();

    // TODO: Format errors for better readability
    configSchema.parse(config);

    // Validate brick keys for duplicates, data is validated in BrickBuilder already
    if (!config.bricks) return;
    const brickKeys = config.bricks.map((brick) => brick.key);
    const uniqueBrickKeys = [...new Set(brickKeys)];
    if (brickKeys.length !== uniqueBrickKeys.length) {
      throw new RuntimeError(
        "Each brick key must be unique, found duplicates in lucid.config.ts/js."
      );
    }
  };
  public static findPath = (cwd: string): string => {
    // if specified, use the specified path
    if (process.env.LUCID_CONFIG_PATH) {
      if (path.isAbsolute(process.env.LUCID_CONFIG_PATH)) {
        return process.env.LUCID_CONFIG_PATH;
      }

      return path.resolve(process.cwd(), process.env.LUCID_CONFIG_PATH);
    }

    // recursively search for the config file by navigating up the directory tree
    let configPath: string | undefined = undefined;
    const root = path.parse(cwd).root;
    const configFileName = "lucid.config";
    const configExtensions = [".ts", ".js"];

    const search = (cwd: string): void => {
      const files = fs.readdirSync(cwd);
      const configFiles = files.filter((file) => {
        const { name, ext } = path.parse(file);
        return name === configFileName && configExtensions.includes(ext);
      });

      if (configFiles.length > 0) {
        configPath = path.resolve(cwd, configFiles[0]);
        return;
      }

      const parent = path.resolve(cwd, "..");
      if (parent === cwd || parent === root) {
        return;
      }

      search(parent);
    };
    search(cwd);

    if (!configPath) {
      throw new RuntimeError(
        "Cannot find the lucid.config.ts or lucid.config.js file at the root of your project."
      );
    }

    return configPath;
  };
  // -------------------------------------------
  // Util Methods
  static get = (): ConfigT => {
    if (Config._configCache) {
      return Config._configCache;
    }

    const configPath = Config.findPath(process.cwd());
    const config = require(configPath).default as ConfigT;

    Config._configCache = config;

    return config;
  };
  // getters
  static get secretKey() {
    return Config.get().secretKey;
  }
  static get environment() {
    return Config.get().environment;
  }
  static get databaseUrl() {
    return Config.get().databaseUrl;
  }
  static get postTypes() {
    return Config.get().postTypes;
  }
}
