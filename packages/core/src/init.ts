require("dotenv").config();
import express from "express";
// Middleware
import compression from "compression";
import responseTime from "response-time";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import timeout from "connect-timeout";
import helmet from "helmet";
// Internal
import { log } from "console-log-colors";
import { initializePool } from "@db/db";
import migrateDB from "@db/migration";
import initRoutes from "@routes/index";
import {
  errorLogger,
  errorResponder,
  invalidPathHandler,
} from "@utils/app/error-handler";
// Service
import Config from "@services/Config";

const app = async (options: InitOptions) => {
  const app = options.express;

  // ------------------------------------
  // Config
  await Config.cacheConfig();
  await initializePool();

  // ------------------------------------
  // Server wide middleware
  log.white("----------------------------------------------------");
  app.use(express.json());
  app.use(
    compression({
      level: 6,
    })
  );
  app.use(responseTime());
  app.use(
    cors({
      origin: Config.origin,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization", "_csrf"],
      credentials: true,
    })
  );
  app.use(timeout("10s"));
  app.use(morgan("dev"));
  app.use(cookieParser(Config.secret));
  app.use(
    fileUpload({
      debug: Config.mode === "development",
    })
  );
  app.use(helmet({}));

  log.yellow("Middleware configured");

  // ------------------------------------
  // Initialise database
  log.white("----------------------------------------------------");
  await migrateDB();

  // ------------------------------------
  // Routes
  log.white("----------------------------------------------------");
  if (options.public) app.use("/api/public", express.static(options.public));
  initRoutes(app);
  // Serve CMS
  app.use("/", express.static(path.join(__dirname, "../cms")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../cms", "index.html"));
  });
  log.yellow("Routes initialised");

  // ------------------------------------
  // Error handling
  app.use(errorLogger);
  app.use(errorResponder);
  app.use(invalidPathHandler);

  return app;
};

export default app;
