import("dotenv/config.js");
import path from "path";
import { log } from "console-log-colors";

import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";
import fs from "fs-extra";
// Core
import { initialisePool } from "@db/db.js";
import migrateDB from "@db/migration.js";
import routes from "@routes/index.js";
// Utils
import service from "@utils/app/service.js";
import getDirName from "@utils/app/get-dirname.js";
import {
  errorLogger,
  errorResponder,
  invalidPathHandler,
} from "@utils/app/error-handler.js";
// Service
import Config from "@services/Config.js";
import Initialise from "@services/Initialise.js";

const currentDir = getDirName(import.meta.url);

const lucid = async (
  fastify: FastifyInstance,
  options: Record<string, any>
) => {
  // ------------------------------------
  // Config
  await Config.cachedConfig();

  // ------------------------------------
  // INitialise app
  log.white("----------------------------------------------------");
  await initialisePool();
  log.yellow("Database initialised");

  // ------------------------------------
  // Server wide middleware
  log.white("----------------------------------------------------");
  fastify.register(cors, {
    origin: Config.origin,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "_csrf",
      "lucid-environment",
      "lucid-content-lang",
    ],
    credentials: true,
  });
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
  fastify.register(routes);
  fastify.register(fastifyStatic, {
    root: [path.resolve("public"), path.join(currentDir, "../cms")],
    wildcard: false,
  });
  fastify.setNotFoundHandler((request, reply) => {
    const indexPath = path.resolve(currentDir, "../cms/index.html");
    if (fs.existsSync(indexPath)) {
      const stream = fs.createReadStream(indexPath);
      reply.type("text/html").send(stream);
    } else {
      reply.code(404).send("Page not found");
    }
  });

  log.yellow("Routes initialised");

  // ------------------------------------
  // Error handling
  // fastify.use(errorLogger);
  // fastify.use(errorResponder);
  // fastify.use(invalidPathHandler);
};

export default fp(lucid, {
  name: "lucid",
  fastify: "4.x",
});
