import auth from "./v1/auth";
import health from "./v1/health";

const registerRoutes = (app: any) => {
  // Version 1
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/health", health);
};

export default registerRoutes;
