import fs from "fs-extra";
import path from "path";
import z from "zod";
import { RuntimeError } from "@utils/error-handler";
import { bgRed } from "console-log-colors";
import C from "@root/constants";
import { fromZodError } from "zod-validation-error";
// Internal packages
import { BrickBuilderT } from "@lucid/brick-builder";
import { CollectionBuilderT } from "@lucid/collection-builder";
import { FormBuilderT } from "@lucid/form-builder";

// -------------------------------------------
// Config
const configSchema = z.object({
  origin: z.string(),
  mode: z.enum(["development", "production"]),
  postgresURL: z.string(),
  secret: z.string(),
  forms: z.array(z.any()).optional(),
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
      from: z.object({
        name: z.string(),
        email: z.string().email(),
      }),
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
  origin: string;
  mode: "development" | "production";
  postgresURL: string;
  secret: string;
  environments: Array<{
    title: string;
    key: string;
  }>;
  forms?: FormBuilderT[];
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
    from: {
      name: string;
      email: string;
    };
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
  public static validate = (config: ConfigT) => {
    try {
      configSchema.parse(config);

      Config.#validateBricks(config);
      Config.#validateCollections(config);
      Config.#validateForms(config);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        const message = validationError.message.split("Validation error: ")[1];
        console.error(bgRed(`Config validation error: ${message}`));
        process.exit(1);
      } else {
        throw error;
      }
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
  // Functions
  static getConfig = async (): Promise<ConfigT> => {
    return await Config.cacheConfig();
  };
  static cacheConfig = async (): Promise<ConfigT> => {
    if (Config.configCache) {
      return Config.configCache;
    }

    const configPath = Config.findPath(process.cwd());
    let configModule = await import(configPath);
    let config = configModule.default as ConfigT;

    Config._configCache = config;

    return config;
  };
  // getters
  static get configCache() {
    return Config._configCache as ConfigT;
  }
  static get mode() {
    return Config.configCache.mode;
  }
  static get environments() {
    return Config.configCache.environments;
  }
  static get media() {
    const media = Config.configCache?.media;
    return {
      storageLimit: media?.storageLimit || C.media.storageLimit,
      maxFileSize: media?.maxFileSize || C.media.maxFileSize,
      store: {
        service: media?.store.service,
        cloudflareAccountId: media?.store.cloudflareAccountId,
        region: media?.store.region,
        bucket: media?.store.bucket,
        accessKeyId: media?.store.accessKeyId,
        secretAccessKey: media?.store.secretAccessKey,
      },
    };
  }
  static get email() {
    return Config.configCache.email;
  }
  static get secret() {
    return Config.configCache.secret;
  }
  static get bricks() {
    return Config.configCache.bricks;
  }
  static get collections() {
    return Config.configCache.collections;
  }
  static get postgresURL() {
    return Config.configCache.postgresURL;
  }
  static get origin() {
    return Config.configCache.origin;
  }
  static get forms() {
    return Config.configCache.forms;
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
  static #validateForms(config: ConfigT) {
    if (!config.forms) return;
    const formKeys = config.forms.map((form) => form.key);
    const uniqueFormKeys = [...new Set(formKeys)];
    if (formKeys.length !== uniqueFormKeys.length) {
      throw new RuntimeError(
        "Each form key must be unique, found duplicates in lucid.config.ts/js."
      );
    }
  }
}

export const buildConfig = (config: ConfigT) => {
  Config.validate(config);
  return config;
};
