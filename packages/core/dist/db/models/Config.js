"use strict";
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
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const zod_1 = __importDefault(require("zod"));
const error_handler_1 = require("../../utils/error-handler");
const constants_1 = __importDefault(require("../../constants"));
const configSchema = zod_1.default.object({
    port: zod_1.default.number(),
    origin: zod_1.default.string().optional(),
    mode: zod_1.default.enum(["development", "production"]),
    databaseUrl: zod_1.default.string(),
    secretKey: zod_1.default.string(),
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
});
class Config {
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
            storageLimit: media?.storageLimit || constants_1.default.media.storageLimit,
            maxFileSize: media?.maxFileSize || constants_1.default.media.maxFileSize,
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
Config.validate = () => {
    const config = Config.get();
    configSchema.parse(config);
    __classPrivateFieldGet(Config, _a, "m", _Config_validateBricks).call(Config, config);
    __classPrivateFieldGet(Config, _a, "m", _Config_validateCollections).call(Config, config);
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
Config.get = () => {
    if (Config._configCache) {
        return Config._configCache;
    }
    const configPath = Config.findPath(process.cwd());
    const config = require(configPath).default;
    Config._configCache = config;
    return config;
};
exports.default = Config;
//# sourceMappingURL=Config.js.map