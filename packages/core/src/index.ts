require("dotenv").config();
import http from "http";
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

type Start = (config: ConfigT) => Promise<void>;

const start: Start = async (config) => {
  const app = express();
  const server = http.createServer(app);

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

  // ------------------------------------
  // Start server
  server.listen(config.port, () => {
    log.white("----------------------------------------------------");
    log.yellow(`CMS started at: http://localhost:${config.port}`);
    log.yellow(`API started at: http://localhost:${config.port}/api`);
    log.white("----------------------------------------------------");
  });
};

const exportObject = { start };

export default exportObject;
