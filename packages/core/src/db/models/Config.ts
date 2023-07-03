import fs from "fs-extra";
import path from "path";
import z from "zod";
import { RuntimeError } from "@utils/error-handler";
import C from "@root/constants";
// Internal packages
import { BrickBuilderT } from "@lucid/brick-builder";
import { CollectionBuilderT } from "@lucid/collection-builder";

// -------------------------------------------
// Config
const configSchema = z.object({
  port: z.number(),
  origin: z.string().optional(),
  mode: z.enum(["development", "production"]),
  databaseUrl: z.string(),
  secretKey: z.string(),
  collections: z.array(z.any()).optional(),
  bricks: z.array(z.any()).optional(),
  media: z.object({
    storageLimit: z.number().optional(),
    maxFileSize: z.number().optional(),
    store: z.object({
      service: z.enum(["aws", "cloudflare"]),
      cloudflareAccountId: z.string().optional(),
      region: z.string(),
      bucket: z.string(),
      accessKeyId: z.string(),
      secretAccessKey: z.string(),
    }),
  }),
  email: z
    .object({
      from: z.union([
        z.string(),
        z.object({
          name: z.string(),
          email: z.string().email(),
        }),
      ]),
      templateDir: z.string().optional(),
      smtp: z
        .object({
          host: z.string(),
          port: z.number(),
          user: z.string(),
          pass: z.string(),
          secure: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),
  environments: z.array(
    z.object({
      title: z.string(),
      key: z.string(),
    })
  ),
});

export type ConfigT = {
  port: number;
  origin?: string;
  mode: "development" | "production";
  databaseUrl: string;
  secretKey: string;
  environments: Array<{
    title: string;
    key: string;
  }>;
  collections?: CollectionBuilderT[];
  bricks?: BrickBuilderT[];
  media: {
    storageLimit?: number;
    maxFileSize?: number;
    store: {
      service: "aws" | "cloudflare";
      cloudflareAccountId?: string;
      region?: string;
      bucket: string;
      accessKeyId: string;
      secretAccessKey: string;
    };
  };
  email?: {
    from:
      | {
          name?: string;
          email: string;
        }
      | string;
    templateDir?: string;
    smtp?: {
      host: string;
      port: number;
      user: string;
      pass: string;
      secure?: boolean;
    };
  };
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
  // Functions
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
  static get mode() {
    return Config.get().mode;
  }
  static get databaseUrl() {
    return Config.get().databaseUrl;
  }
  static get environments() {
    return Config.get().environments;
  }
  static get media() {
    const media = Config.get().media;
    return {
      storageLimit: media?.storageLimit || C.media.storageLimit,
      maxFileSize: media?.maxFileSize || C.media.maxFileSize,
      store: {
        service: media.store.service,
        cloudflareAccountId: media.store.cloudflareAccountId,
        region: media.store.region,
        bucket: media.store.bucket,
        accessKeyId: media.store.accessKeyId,
        secretAccessKey: media.store.secretAccessKey,
      },
    };
  }
  static get email() {
    return Config.get().email;
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
