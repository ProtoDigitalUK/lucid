"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const http_1 = __importDefault(require("http"));
const console_log_colors_1 = require("console-log-colors");
const Config_1 = __importDefault(require("./db/models/Config"));
const app_1 = __importDefault(require("./app"));
const start = async () => {
    const server = http_1.default.createServer(await (0, app_1.default)());
    server.listen(Config_1.default.get().port, () => {
        console_log_colors_1.log.white("----------------------------------------------------");
        console_log_colors_1.log.yellow(`CMS started at: http://localhost:${Config_1.default.get().port}`);
        console_log_colors_1.log.yellow(`API started at: http://localhost:${Config_1.default.get().port}/api`);
        console_log_colors_1.log.white("----------------------------------------------------");
    });
};
exports.default = {
    start,
};
//# sourceMappingURL=index.js.map