"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const console_log_colors_1 = require("console-log-colors");
const db_1 = require("./db/db");
const migration_1 = __importDefault(require("./db/migration"));
const index_1 = __importDefault(require("./routes/index"));
const service_1 = __importDefault(require("./utils/app/service"));
const error_handler_1 = require("./utils/app/error-handler");
const Config_1 = __importDefault(require("./services/Config"));
const Initialise_1 = __importDefault(require("./services/Initialise"));
const app = async (options) => {
    const app = options.express;
    await Config_1.default.cacheConfig();
    console_log_colors_1.log.white("----------------------------------------------------");
    await (0, db_1.initializePool)();
    console_log_colors_1.log.yellow("Database initialised");
    console_log_colors_1.log.white("----------------------------------------------------");
    app.use(express_1.default.json());
    app.use((0, cors_1.default)({
        origin: Config_1.default.origin,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "_csrf",
            "lucid-environment",
        ],
        credentials: true,
    }));
    app.use((0, morgan_1.default)("dev"));
    app.use((0, cookie_parser_1.default)(Config_1.default.secret));
    app.use((0, express_fileupload_1.default)({
        debug: Config_1.default.mode === "development",
    }));
    console_log_colors_1.log.yellow("Middleware configured");
    console_log_colors_1.log.white("----------------------------------------------------");
    await (0, migration_1.default)();
    console_log_colors_1.log.white("----------------------------------------------------");
    await (0, service_1.default)(Initialise_1.default, true)();
    console_log_colors_1.log.yellow("Start up tasks complete");
    console_log_colors_1.log.white("----------------------------------------------------");
    if (options.public)
        app.use("/public", express_1.default.static(options.public));
    (0, index_1.default)(app);
    app.use("/", express_1.default.static(path_1.default.join(__dirname, "../cms")));
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.resolve(__dirname, "../cms", "index.html"));
    });
    console_log_colors_1.log.yellow("Routes initialised");
    app.use(error_handler_1.errorLogger);
    app.use(error_handler_1.errorResponder);
    app.use(error_handler_1.invalidPathHandler);
    return app;
};
exports.default = app;
//# sourceMappingURL=init.js.map