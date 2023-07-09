// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import authSchema from "@schemas/auth";
// Services
import { clearJWT } from "@services/auth/jwt";
import { clearCSRFToken } from "@services/auth/csrf";

// --------------------------------------------------
// Controller
const logout: Controller<
  typeof authSchema.logout.params,
  typeof authSchema.logout.body,
  typeof authSchema.logout.query
> = async (req, res, next) => {
  try {
    clearJWT(res);
    clearCSRFToken(res);

    res.status(200).json(
      buildResponse(req, {
        data: {
          message: "Logged out successfully",
        },
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: authSchema.logout,
  controller: logout,
};
