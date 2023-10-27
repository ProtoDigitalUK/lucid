// API
import auth from "@routes/v1/auth.routes.js";
import health from "@routes/v1/health.routes.js";
import categories from "@routes/v1/categories.routes.js";
import pages from "@routes/v1/pages.routes.js";
import singlePages from "@routes/v1/single-pages.routes.js";
import collections from "@routes/v1/collections.routes.js";
import environments from "@routes/v1/environments.routes.js";
import roles from "@routes/v1/roles.routes.js";
import users from "@routes/v1/users.routes.js";
import permissions from "@routes/v1/permissions.routes.js";
import bricks from "@routes/v1/bricks.routes.js";
import menus from "@routes/v1/menus.routes.js";
import media from "@routes/v1/media.routes.js";
import emails from "@routes/v1/emails.routes.js";
import forms from "@routes/v1/forms.routes.js";
import options from "@routes/v1/options.routes.js";
import account from "@routes/v1/account.routes.js";
import settings from "@routes/v1/settings.routes.js";
import languages from "@routes/v1/languages.routes.js";
// CDN
import cdn from "@routes/v1/cdn.routes.js";

const initRoutes = (app: any) => {
  // Version 1
  app.use("/cdn/v1", cdn);
  // API
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/health", health);
  app.use("/api/v1/categories", categories);
  app.use("/api/v1/pages", pages);
  app.use("/api/v1/single-page", singlePages);
  app.use("/api/v1/collections", collections);
  app.use("/api/v1/environments", environments);
  app.use("/api/v1/roles", roles);
  app.use("/api/v1/users", users);
  app.use("/api/v1/permissions", permissions);
  app.use("/api/v1/bricks", bricks);
  app.use("/api/v1/menus", menus);
  app.use("/api/v1/media", media);
  app.use("/api/v1/emails", emails);
  app.use("/api/v1/forms", forms);
  app.use("/api/v1/options", options);
  app.use("/api/v1/account", account);
  app.use("/api/v1/settings", settings);
  app.use("/api/v1/languages", languages);
};

export default initRoutes;
