import { FastifyInstance } from "fastify";

// API
import auth from "@routes/v1/api/auth.routes.js";
import health from "@routes/v1/api/health.routes.js";
import categories from "@routes/v1/api/categories.routes.js";
import pages from "@routes/v1/api/pages.routes.js";
import singlePages from "@routes/v1/api/single-pages.routes.js";
import collections from "@routes/v1/api/collections.routes.js";
import environments from "@routes/v1/api/environments.routes.js";
import roles from "@routes/v1/api/roles.routes.js";
import users from "@routes/v1/api/users.routes.js";
import permissions from "@routes/v1/api/permissions.routes.js";
import bricks from "@routes/v1/api/bricks.routes.js";
import menus from "@routes/v1/api/menus.routes.js";
import media from "@routes/v1/api/media.routes.js";
import emails from "@routes/v1/api/emails.routes.js";
import forms from "@routes/v1/api/forms.routes.js";
import options from "@routes/v1/api/options.routes.js";
import account from "@routes/v1/api/account.routes.js";
import settings from "@routes/v1/api/settings.routes.js";
import languages from "@routes/v1/api/languages.routes.js";

const routes = async (fastify: FastifyInstance) => {
  // Version 1
  // API
  // fastify.register(auth, {
  //   prefix: "/auth",
  // });
  // fastify.register(health, {
  //   prefix: "/health",
  // });
  // fastify.register(categories, {
  //   prefix: "/categories",
  // });
  // fastify.register(pages, {
  //   prefix: "/pages",
  // });
  // fastify.register(singlePages, {
  //   prefix: "/single-page",
  // });
  // fastify.register(collections, {
  //   prefix: "/collections",
  // });
  // fastify.register(environments, {
  //   prefix: "/environments",
  // });
  // fastify.register(roles, {
  //   prefix: "/roles",
  // });
  // fastify.register(users, {
  //   prefix: "/users",
  // });
  // fastify.register(permissions, {
  //   prefix: "/permissions",
  // });
  // fastify.register(bricks, {
  //   prefix: "/bricks",
  // });
  // fastify.register(menus, {
  //   prefix: "/menus",
  // });
  // fastify.register(media, {
  //   prefix: "/media",
  // });
  // fastify.register(emails, {
  //   prefix: "/emails",
  // });
  // fastify.register(forms, {
  //   prefix: "/forms",
  // });
  // fastify.register(options, {
  //   prefix: "/options",
  // });
  // fastify.register(account, {
  //   prefix: "/account",
  // });
  // fastify.register(settings, {
  //   prefix: "/settings",
  // });
  // fastify.register(languages, {
  //   prefix: "/languages",
  // });
};

export default routes;
