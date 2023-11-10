import("dotenv/config.js");
import path from "path";
import { log, red } from "console-log-colors";

import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import fs from "fs-extra";
import fastifyMultipart from "@fastify/multipart";

// Core
import { initialisePool } from "@db/db.js";
import migrateDB from "@db/migration.js";
import routes from "@routes/index.js";
// Utils
import service from "@utils/app/service.js";
import getDirName from "@utils/app/get-dirname.js";
import { decodeError } from "@utils/app/error-handler.js";
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
  const config = await Config.cachedConfig();

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
      "Content-Length",
    ],
    credentials: true,
  });
  fastify.register(fastifyCookie, {
    secret: Config.secret,
  });
  fastify.register(fastifyMultipart, {
    limits: {
      fileSize: config.media.maxFileSize,
    },
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
  fastify.setErrorHandler((error, request, reply) => {
    const { name, message, status, errors, code } = decodeError(error);

    request.log.error(red(`${status} - ${message}`));

    if (reply.sent) {
      request.log.error("Headers were already sent!");
      return;
    }

    const response = Object.fromEntries(
      Object.entries({
        code,
        status,
        name,
        message,
        errors,
      }).filter(([_, value]) => value !== null)
    );

    reply.status(status).send(response);
  });
};

export default fp(lucid, {
  name: "lucid",
  fastify: "4.x",
});
