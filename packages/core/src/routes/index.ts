import auth from "@routes/v1/auth.routes";
import health from "@routes/v1/health.routes";
import bricks from "@routes/v1/bricks.routes";
import postTypes from "@routes/v1/post-types.routes";
import categories from "@routes/v1/categories.routes";

const initRoutes = (app: any) => {
  // Version 1
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/health", health);
  app.use("/api/v1/bricks", bricks);
  app.use("/api/v1/post-types", postTypes);
  app.use("/api/v1/categories", categories);
};

export default initRoutes;
