require("dotenv").config();
import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { log } from "console-log-colors";
// Core
import { initializePool } from "@db/db";
import migrateDB from "@db/migration";
import initRoutes from "@routes/index";
// Utils
import service from "@utils/app/service";
import {
  errorLogger,
  errorResponder,
  invalidPathHandler,
} from "@utils/app/error-handler";
// Service
import Config from "@services/Config";
import Initialise from "@services/Initialise";

const app = async (options: InitOptions) => {
  const app = options.express;

  // ------------------------------------
  // Config
  await Config.cacheConfig();

  // ------------------------------------
  // INitialise app
  log.white("----------------------------------------------------");
  await initializePool();
  log.yellow("Database initialised");

  // ------------------------------------
  // Server wide middleware
  log.white("----------------------------------------------------");
  app.use(express.json());
  app.use(
    cors({
      origin: Config.origin,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "_csrf",
        "lucid-environment",
      ],
      credentials: true,
    })
  );
  app.use(morgan("dev"));
  app.use(cookieParser(Config.secret));
  log.yellow("Middleware configured");

  // ------------------------------------
  // Initialise database
  log.white("----------------------------------------------------");
  await migrateDB();

  // ------------------------------------
  // Initialise app
  log.white("----------------------------------------------------");
  await service(Initialise, true)();
  log.yellow("Start up tasks complete");

  // ------------------------------------
  // Routes
  log.white("----------------------------------------------------");
  if (options.public) app.use("/public", express.static(options.public));
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
