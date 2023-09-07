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
> = async (req, res, next) => {
  try {
    const resetPassword = await service(
      authService.sendResetPassword,
      false
    )({
      email: req.body.email,
    });

    res.status(200).json(
      buildResponse(req, {
        data: resetPassword,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: authSchema.sendResetPassword,
  controller: sendResetPasswordController,
};
