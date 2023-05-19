"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const console_log_colors_1 = require("console-log-colors");
const path_1 = __importDefault(require("path"));
const error_handler_1 = require("./utils/error-handler");
const index_1 = __importDefault(require("./routes/index"));
const start = async ({ port = 8393, origin = "*" }) => {
    console_log_colors_1.log.white("----------------------------------------------------");
    const app = (0, express_1.default)();
    const server = http_1.default.createServer(app);
    app.use(express_1.default.json());
    app.use((0, cors_1.default)({
        origin: origin,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }));
    app.use((0, morgan_1.default)("dev"));
    app.use("/", express_1.default.static(path_1.default.join(__dirname, "../cms"), { extensions: ["html"] }));
    (0, index_1.default)(app);
    console_log_colors_1.log.yellow("Routes initialised");
    app.use(error_handler_1.errorLogger);
    app.use(error_handler_1.errorResponder);
    app.use(error_handler_1.invalidPathHandler);
    server.listen(port, () => {
        console_log_colors_1.log.white("----------------------------------------------------");
        console_log_colors_1.log.yellow(`CMS started at: http://localhost:${port}`);
        console_log_colors_1.log.yellow(`API started at: http://localhost:${port}/api`);
        console_log_colors_1.log.white("----------------------------------------------------");
    });
};
const exportObject = { start };
exports.default = exportObject;
//# sourceMappingURL=index.js.map