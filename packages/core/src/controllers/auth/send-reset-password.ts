// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import authSchema from "@schemas/auth.js";
// Services
import authService from "@services/auth/index.js";

// --------------------------------------------------
// Controller
const sendResetPasswordController: Controller<
  typeof authSchema.sendResetPassword.params,
  typeof authSchema.sendResetPassword.body,
  typeof authSchema.sendResetPassword.query
> = async (request, reply) => {
  const resetPassword = await service(
    authService.sendResetPassword,
    false
  )({
    email: request.body.email,
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
  schema: authSchema.sendResetPassword,
  controller: sendResetPasswordController,
};
