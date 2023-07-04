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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _Config_validateBricks, _Config_validateCollections;
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildConfig = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const zod_1 = __importDefault(require("zod"));
const error_handler_1 = require("../../utils/error-handler");
const console_log_colors_1 = require("console-log-colors");
const constants_1 = __importDefault(require("../../constants"));
const zod_validation_error_1 = require("zod-validation-error");
const configSchema = zod_1.default.object({
    origin: zod_1.default.string(),
    mode: zod_1.default.enum(["development", "production"]),
    postgresURL: zod_1.default.string(),
    secret: zod_1.default.string(),
    collections: zod_1.default.array(zod_1.default.any()).optional(),
    bricks: zod_1.default.array(zod_1.default.any()).optional(),
    media: zod_1.default.object({
        storageLimit: zod_1.default.number().optional(),
        maxFileSize: zod_1.default.number().optional(),
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
    environments: zod_1.default.array(zod_1.default.object({
        title: zod_1.default.string(),
        key: zod_1.default.string(),
    })),
});
class Config {
    static get configCache() {
        return Config._configCache;
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
            storageLimit: media?.storageLimit || constants_1.default.media.storageLimit,
            maxFileSize: media?.maxFileSize || constants_1.default.media.maxFileSize,
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
}
_a = Config, _Config_validateBricks = function _Config_validateBricks(config) {
    if (!config.bricks)
        return;
    const brickKeys = config.bricks.map((brick) => brick.key);
    const uniqueBrickKeys = [...new Set(brickKeys)];
    if (brickKeys.length !== uniqueBrickKeys.length) {
        throw new error_handler_1.RuntimeError("Each brick key must be unique, found duplicates in lucid.config.ts/js.");
    }
}, _Config_validateCollections = function _Config_validateCollections(config) {
    if (!config.collections)
        return;
    const collectionKeys = config.collections.map((collection) => collection.key);
    const uniqueCollectionKeys = [...new Set(collectionKeys)];
    if (collectionKeys.length !== uniqueCollectionKeys.length) {
        throw new error_handler_1.RuntimeError("Each collection key must be unique, found duplicates in lucid.config.ts/js.");
    }
};
Config._configCache = null;
Config.validate = (config) => {
    try {
        configSchema.parse(config);
        __classPrivateFieldGet(Config, _a, "m", _Config_validateBricks).call(Config, config);
        __classPrivateFieldGet(Config, _a, "m", _Config_validateCollections).call(Config, config);
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
Config.findPath = (cwd) => {
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
        throw new error_handler_1.RuntimeError("Cannot find the lucid.config.ts or lucid.config.js file at the root of your project.");
    }
    return configPath;
};
Config.getConfig = async () => {
    return await Config.cacheConfig();
};
Config.cacheConfig = async () => {
    if (Config.configCache) {
        return Config.configCache;
    }
    const configPath = Config.findPath(process.cwd());
    let configModule = await Promise.resolve(`${configPath}`).then(s => __importStar(require(s)));
    let config = configModule.default;
    Config._configCache = config;
    return config;
};
exports.default = Config;
const buildConfig = (config) => {
    Config.validate(config);
    return config;
};
exports.buildConfig = buildConfig;
//# sourceMappingURL=Config.js.map