require("dotenv").config();
import express, { Express } from "express";
import morgan from "morgan";
import cors from "cors";
import { log } from "console-log-colors";
import path from "path";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
// internal
import Config from "@db/models/Config";
import launchSteps from "@utils/app/launch-steps";
import migrateDB from "@db/migration";
import initRoutes from "@routes/index";
import {
  errorLogger,
  errorResponder,
  invalidPathHandler,
} from "@utils/app/error-handler";

const app = async (options: InitOptions) => {
  const app = options.express;

  // ------------------------------------
  // Config
  await Config.cacheConfig();

  // ------------------------------------
  // Server wide middleware
  log.white("----------------------------------------------------");
  app.use(express.json());
  app.use(
    cors({
      origin: Config.origin,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(morgan("dev"));
  app.use(cookieParser(Config.secret));
  app.use(
    fileUpload({
      debug: Config.mode === "development",
    })
  );
  log.yellow("Middleware configured");

  // ------------------------------------
  // Initialise database
  log.white("----------------------------------------------------");
  await migrateDB();

  // ------------------------------------
  // Launch steps
  log.white("----------------------------------------------------");
  await launchSteps();
  log.yellow("Launch steps ran");

  // ------------------------------------
  // Routes
  log.white("----------------------------------------------------");
  app.use(
    "/",
    express.static(path.join(__dirname, "../cms"), { extensions: ["html"] })
  );
  if (options.public) app.use("/api/public", express.static(options.public));
  initRoutes(app);
  log.yellow("Routes initialised");

  // ------------------------------------
  // Error handling
  app.use(errorLogger);
  app.use(errorResponder);
  app.use(invalidPathHandler);

  return app;
};

export default app;
