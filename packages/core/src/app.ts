require("dotenv").config();
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { log } from "console-log-colors";
import path from "path";
// Utils
import {
  errorLogger,
  errorResponder,
  invalidPathHandler,
} from "@utils/error-handler";
//  Initialise
import migrateDB from "@db/migration";
import initRoutes from "@routes/index";
import Config, { type ConfigT } from "@utils/config";

const app = async (config: ConfigT) => {
  const app = express();

  // ------------------------------------
  // Config
  log.white("----------------------------------------------------");
  await Config.validate(config);
  await Config.set(config);
  log.yellow("Config initialised");

  // ------------------------------------
  // Server wide middleware
  log.white("----------------------------------------------------");
  app.use(express.json());
  app.use(
    cors({
      origin: config.origin,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(morgan("dev"));
  log.yellow("Middleware initialised");

  // ------------------------------------
  // Initialise database
  log.white("----------------------------------------------------");
  await migrateDB();

  // ------------------------------------
  // Routes
  log.white("----------------------------------------------------");
  app.use(
    "/",
    express.static(path.join(__dirname, "../cms"), { extensions: ["html"] })
  );
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
