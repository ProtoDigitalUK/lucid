import { FastifyInstance } from "fastify";
import r from "@utils/app/route.js";
// Controller
import getSettings from "@controllers/settings/get-settings.js";

const settingRoutes = async (fastify: FastifyInstance) => {
  r(fastify, {
    method: "get",
    url: "/",
    middleware: {
      authenticate: true,
    },
    schema: getSettings.schema,
    controller: getSettings.controller,
  });
};

export default settingRoutes;
