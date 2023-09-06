"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildConfig = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const zod_1 = __importDefault(require("zod"));
const error_handler_js_1 = require("../utils/app/error-handler.js");
const console_log_colors_1 = require("console-log-colors");
const constants_js_1 = __importDefault(require("../constants.js"));
const zod_validation_error_1 = require("zod-validation-error");
const configSchema = zod_1.default.object({
    host: zod_1.default.string(),
    origin: zod_1.default.string(),
    mode: zod_1.default.enum(["development", "production"]),
    postgresURL: zod_1.default.string(),
    secret: zod_1.default.string(),
    forms: zod_1.default.array(zod_1.default.any()).optional(),
    collections: zod_1.default.array(zod_1.default.any()).optional(),
    bricks: zod_1.default.array(zod_1.default.any()).optional(),
    media: zod_1.default.object({
        storageLimit: zod_1.default.number().optional(),
        maxFileSize: zod_1.default.number().optional(),
        fallbackImage: zod_1.default.union([zod_1.default.string(), zod_1.default.boolean()]).optional(),
        processedImageLimit: zod_1.default.number().optional(),
        store: zod_1.default.object({
            service: zod_1.default.enum(["aws", "cloudflare"]),
            cloudflareAccountId: zod_1.default.string().optional(),
            region: zod_1.default.string(),
            bucket: zod_1.default.string(),
            accessKeyId: zod_1.default.string(),
            secretAccessKey: zod_1.default.string(),
        }),
    }),
    email: zod_1.default
        .object({
        from: zod_1.default.object({
            name: zod_1.default.string(),
            email: zod_1.default.string().email(),
        }),
        templateDir: zod_1.default.string().optional(),
        smtp: zod_1.default
            .object({
            host: zod_1.default.string(),
            port: zod_1.default.number(),
            user: zod_1.default.string(),
            pass: zod_1.default.string(),
            secure: zod_1.default.boolean().optional(),
        })
            .optional(),
    })
        .optional(),
});
class Config {
    static _configCache = null;
    static validate = (config) => {
        try {
            configSchema.parse(config);
            Config.#validateBricks(config);
            Config.#validateCollections(config);
            Config.#validateForms(config);
        }
        catch (error) {
            if (error instanceof zod_1.default.ZodError) {
                const validationError = (0, zod_validation_error_1.fromZodError)(error);
                const message = validationError.message.split("Validation error: ")[1];
                console.error((0, console_log_colors_1.bgRed)(`Config validation error: ${message}`));
                process.exit(1);
            }
            else {
                throw error;
            }
        }
    };
    static findPath = (cwd) => {
        if (process.env.LUCID_CONFIG_PATH) {
            if (path_1.default.isAbsolute(process.env.LUCID_CONFIG_PATH)) {
                return process.env.LUCID_CONFIG_PATH;
            }
            return path_1.default.resolve(process.cwd(), process.env.LUCID_CONFIG_PATH);
        }
        let configPath = undefined;
        const root = path_1.default.parse(cwd).root;
        const configFileName = "lucid.config";
        const configExtensions = [".ts", ".js"];
        const search = (cwd) => {
            const files = fs_extra_1.default.readdirSync(cwd);
            const configFiles = files.filter((file) => {
                const { name, ext } = path_1.default.parse(file);
                return name === configFileName && configExtensions.includes(ext);
            });
            if (configFiles.length > 0) {
                configPath = path_1.default.resolve(cwd, configFiles[0]);
                return;
            }
            const parent = path_1.default.resolve(cwd, "..");
            if (parent === cwd || parent === root) {
                return;
            }
            search(parent);
        };
        search(cwd);
        if (!configPath) {
            throw new error_handler_js_1.RuntimeError("Cannot find the lucid.config.ts or lucid.config.js file at the root of your project.");
        }
        return configPath;
    };
    static getConfig = async () => {
        return await Config.cacheConfig();
    };
    static cacheConfig = async () => {
        if (Config.configCache) {
            return Config.configCache;
        }
        const configPath = Config.findPath(process.cwd());
        let configModule = await Promise.resolve(`${configPath}`).then(s => __importStar(require(s)));
        let config = configModule.default;
        Config._configCache = config;
        return config;
    };
    static get configCache() {
        return Config._configCache;
    }
    static get mode() {
        return Config.configCache.mode;
    }
    static get media() {
        const media = Config.configCache?.media;
        return {
            storageLimit: media?.storageLimit || constants_js_1.default.media.storageLimit,
            maxFileSize: media?.maxFileSize || constants_js_1.default.media.maxFileSize,
            fallbackImage: media?.fallbackImage,
            processedImageLimit: media?.processedImageLimit || constants_js_1.default.media.processedImageLimit,
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
    static get host() {
        return Config.configCache.host;
    }
    static #validateBricks(config) {
        if (!config.bricks)
            return;
        const brickKeys = config.bricks.map((brick) => brick.key);
        const uniqueBrickKeys = [...new Set(brickKeys)];
        if (brickKeys.length !== uniqueBrickKeys.length) {
            throw new error_handler_js_1.RuntimeError("Each brick key must be unique, found duplicates in lucid.config.ts/js.");
        }
    }
    static #validateCollections(config) {
        if (!config.collections)
            return;
        const collectionKeys = config.collections.map((collection) => collection.key);
        const uniqueCollectionKeys = [...new Set(collectionKeys)];
        if (collectionKeys.length !== uniqueCollectionKeys.length) {
            throw new error_handler_js_1.RuntimeError("Each collection key must be unique, found duplicates in lucid.config.ts/js.");
        }
    }
    static #validateForms(config) {
        if (!config.forms)
            return;
        const formKeys = config.forms.map((form) => form.key);
        const uniqueFormKeys = [...new Set(formKeys)];
        if (formKeys.length !== uniqueFormKeys.length) {
            throw new error_handler_js_1.RuntimeError("Each form key must be unique, found duplicates in lucid.config.ts/js.");
        }
    }
}
exports.default = Config;
const buildConfig = (config) => {
    Config.validate(config);
    return config;
};
exports.buildConfig = buildConfig;
//# sourceMappingURL=Config.js.map