// Utils
import buildResponse from "@utils/app/build-response.js";
// Schema
import authSchema from "@schemas/auth.js";
// Services
import authService from "@services/auth/index.js";

// --------------------------------------------------
// Controller
const logout: Controller<
  typeof authSchema.logout.params,
  typeof authSchema.logout.body,
  typeof authSchema.logout.query
> = async (request, reply) => {
  authService.jwt.clearJWT(reply);
  authService.csrf.clearCSRFToken(reply);

  reply.status(200).send(
    buildResponse(request, {
      data: {
        message: "Logged out successfully",
      },
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: authSchema.logout,
  controller: logout,
};
