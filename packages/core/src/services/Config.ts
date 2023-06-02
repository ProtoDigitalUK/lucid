import fs from "fs-extra";
import path from "path";
import z from "zod";
import { RuntimeError } from "@utils/error-handler";
// Internal packages
import { BrickBuilderT } from "@lucid/brick-builder";
import { CollectionBuilderT } from "@lucid/collection-builder";

// -------------------------------------------
// Config
const configSchema = z.object({
  port: z.number(),
  origin: z.string().optional(),
  environment: z.enum(["development", "production"]),
  databaseUrl: z.string(),
  secretKey: z.string(),
  collections: z.array(z.any()).optional(),
  bricks: z.array(z.any()).optional(),
});

export type ConfigT = {
  port: number;
  origin?: string;
  environment: "development" | "production";
  databaseUrl: string;
  secretKey: string;
  collections?: CollectionBuilderT[];
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

    Config.#validateBricks(config);
    Config.#validateCollections(config);
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
  // -------------------------------------------
  // Private
  static #validateBricks(config: ConfigT) {
    if (!config.bricks) return;
    const brickKeys = config.bricks.map((brick) => brick.key);
    const uniqueBrickKeys = [...new Set(brickKeys)];
    if (brickKeys.length !== uniqueBrickKeys.length) {
      throw new RuntimeError(
        "Each brick key must be unique, found duplicates in lucid.config.ts/js."
      );
    }
  }
  static #validateCollections(config: ConfigT) {
    if (!config.collections) return;
    const collectionKeys = config.collections.map(
      (collection) => collection.key
    );
    const uniqueCollectionKeys = [...new Set(collectionKeys)];
    if (collectionKeys.length !== uniqueCollectionKeys.length) {
      throw new RuntimeError(
        "Each collection key must be unique, found duplicates in lucid.config.ts/js."
      );
    }
  }
}
