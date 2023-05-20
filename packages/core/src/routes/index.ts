import auth from "@routes/v1/auth.routes";
import health from "@routes/v1/health.routes";
import example from "@routes/v1/example.routes";

const initRoutes = (app: any) => {
  // Version 1
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/health", health);
  app.use("/api/v1/example", example);
};

export default initRoutes;
