"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const zod_1 = __importDefault(require("zod"));
const configSchema = zod_1.default.object({
    port: zod_1.default.number(),
    database_url: zod_1.default.string(),
    origin: zod_1.default.string().optional(),
});
class Config {
    static get database_url() {
        return Config.get().database_url;
    }
}
_a = Config;
Config.validate = async (config) => {
    await configSchema.parseAsync(config);
};
Config.set = async (config) => {
    await fs_extra_1.default.ensureDir(path_1.default.join(__dirname, "../../temp"));
    await fs_extra_1.default.writeFile(path_1.default.join(__dirname, "../../temp/config.json"), JSON.stringify(config, null, 2));
};
Config.get = () => {
    const config = fs_extra_1.default.readFileSync(path_1.default.join(__dirname, "../../temp/config.json"), "utf-8");
    return JSON.parse(config);
};
exports.default = Config;
//# sourceMappingURL=config.js.map