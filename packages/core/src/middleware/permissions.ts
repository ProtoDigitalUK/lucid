import { Request, Response, NextFunction } from "express";
// Utils
import { LucidError, modelErrors } from "@utils/error-handler";
// Models
import { PermissionT } from "@db/models/RolePermission";

// ------------------------------------
// Validate Middleware
const permissions =
  (permissions: Array<PermissionT>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const environment = req.headers["lucid-environment"];
      /*
        Lookup the users role and permissions
        Check if the user has the required permissions, if the permission is suffixed with :environment_key=, 
        replace the environment_key with the environment key from the request headers and check if the user has that permission.

        IE: read_content:environment_key= -> read_content:environment_key=prod_env
      */

      return next();
    } catch (error) {
      return next(error);
    }
  };

export default permissions;
