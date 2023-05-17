import auth from "@routes/v1/auth";
import health from "@routes/v1/health";

const registerRoutes = (app: any) => {
  // Version 1
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/health", health);
};

export default registerRoutes;
