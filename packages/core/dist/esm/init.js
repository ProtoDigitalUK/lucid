require("dotenv").config();
import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { log } from "console-log-colors";
import { initializePool } from "./db/db.js";
import migrateDB from "./db/migration.js";
import initRoutes from "./routes/index.js";
import service from "./utils/app/service.js";
import { errorLogger, errorResponder, invalidPathHandler, } from "./utils/app/error-handler.js";
import Config from "./services/Config.js";
import Initialise from "./services/Initialise.js";
const app = async (options) => {
    const app = options.express;
    await Config.cacheConfig();
    log.white("----------------------------------------------------");
    await initializePool();
    log.yellow("Database initialised");
    log.white("----------------------------------------------------");
    app.use(express.json());
    app.use(cors({
        origin: Config.origin,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "_csrf",
            "lucid-environment",
        ],
        credentials: true,
    }));
    app.use(morgan("dev"));
    app.use(cookieParser(Config.secret));
    log.yellow("Middleware configured");
    log.white("----------------------------------------------------");
    await migrateDB();
    log.white("----------------------------------------------------");
    await service(Initialise, true)();
    log.yellow("Start up tasks complete");
    log.white("----------------------------------------------------");
    if (options.public)
        app.use("/public", express.static(options.public));
    initRoutes(app);
    app.use("/", express.static(path.join(__dirname, "../cms")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../cms", "index.html"));
    });
    log.yellow("Routes initialised");
    app.use(errorLogger);
    app.use(errorResponder);
    app.use(invalidPathHandler);
    return app;
};
export default app;
//# sourceMappingURL=init.js.map