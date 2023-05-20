import auth from "@routes/v1/auth.routes";
import health from "@routes/v1/health.routes";

const initRoutes = (app: any) => {
  // Version 1
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/health", health);
};

export default initRoutes;
