"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const console_log_colors_1 = require("console-log-colors");
const index_1 = __importDefault(require("./index"));
const app = (0, express_1.default)();
index_1.default.init(app);
app.listen(8393, () => {
    console_log_colors_1.log.white("----------------------------------------------------");
    console_log_colors_1.log.yellow(`CMS started at: http://localhost:8393`);
    console_log_colors_1.log.yellow(`API started at: http://localhost:8393/api`);
    console_log_colors_1.log.white("----------------------------------------------------");
});
//# sourceMappingURL=dev.js.map