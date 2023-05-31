"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const zod_1 = __importDefault(require("zod"));
const error_handler_1 = require("../utils/error-handler");
const configSchema = zod_1.default.object({
    port: zod_1.default.number(),
    origin: zod_1.default.string().optional(),
    environment: zod_1.default.enum(["development", "production"]),
    databaseUrl: zod_1.default.string(),
    secretKey: zod_1.default.string(),
    postTypes: zod_1.default.array(zod_1.default.object({
        key: zod_1.default.string().refine((key) => key !== "page"),
        name: zod_1.default.string().refine((name) => name !== "Pages"),
        singularName: zod_1.default.string().refine((name) => name !== "Page"),
    })),
    bricks: zod_1.default.array(zod_1.default.any()).optional(),
});
class Config {
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
Config._configCache = null;
Config.validate = () => {
    const config = Config.get();
    configSchema.parse(config);
    if (!config.bricks)
        return;
    const brickKeys = config.bricks.map((brick) => brick.key);
    const uniqueBrickKeys = [...new Set(brickKeys)];
    if (brickKeys.length !== uniqueBrickKeys.length) {
        throw new error_handler_1.RuntimeError("Each brick key must be unique, found duplicates in lucid.config.ts/js.");
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