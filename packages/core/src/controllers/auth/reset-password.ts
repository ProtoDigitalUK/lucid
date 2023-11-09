// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import authSchema from "@schemas/auth.js";
// Services
import authService from "@services/auth/index.js";

// --------------------------------------------------
// Controller
const resetPasswordController: Controller<
  typeof authSchema.resetPassword.params,
  typeof authSchema.resetPassword.body,
  typeof authSchema.resetPassword.query
> = async (request, reply) => {
  const resetPassword = await service(
    authService.resetPassword,
    false
  )({
    token: request.params.token,
    password: request.body.password,
  });

  reply.status(200).send(
    buildResponse(request, {
      data: resetPassword,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: authSchema.resetPassword,
  controller: resetPasswordController,
};
