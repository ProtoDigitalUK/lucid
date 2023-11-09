// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import authSchema from "@schemas/auth.js";
// Services
import authService from "@services/auth/index.js";

// --------------------------------------------------
// Controller
const verifyResetPasswordController: Controller<
  typeof authSchema.verifyResetPassword.params,
  typeof authSchema.verifyResetPassword.body,
  typeof authSchema.verifyResetPassword.query
> = async (request, reply) => {
  const verifyResetPassword = await service(
    authService.verifyResetPassword,
    false
  )({
    token: request.params.token,
  });

  reply.status(200).send(
    buildResponse(request, {
      data: verifyResetPassword,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: authSchema.verifyResetPassword,
  controller: verifyResetPasswordController,
};
