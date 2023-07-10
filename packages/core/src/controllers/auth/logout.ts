// Utils
import buildResponse from "@utils/app/build-response";
// Schema
import authSchema from "@schemas/auth";
// Services
import auth from "@services/auth";

// --------------------------------------------------
// Controller
const logout: Controller<
  typeof authSchema.logout.params,
  typeof authSchema.logout.body,
  typeof authSchema.logout.query
> = async (req, res, next) => {
  try {
    auth.jwt.clearJWT(res);
    auth.csrf.clearCSRFToken(res);

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
