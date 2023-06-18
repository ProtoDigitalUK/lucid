import { Request, Response, NextFunction } from "express";
// Utils
import { LucidError, modelErrors } from "@utils/error-handler";

// ------------------------------------
// Validate Middleware
const permissions =
  (permissions: Array<string>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const environment = req.headers["lucid-environment"];
      if (!environment) {
        throw new LucidError({
          type: "basic",
          name: "Validation Error",
          message: "You must set the Lucid Environment header.",
          status: 400,
          errors: modelErrors({
            "lucid-environment": {
              code: "required",
              message: "You must set the Lucid Environment header.",
            },
          }),
        });
      }

      // TODO: get the authenticated user's permissionss for the environment and compare them to the permissions required for the route

      return next();
    } catch (error) {
      return next(error);
    }
  };

export default permissions;
