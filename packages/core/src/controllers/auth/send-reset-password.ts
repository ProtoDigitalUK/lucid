// Utils
import buildResponse from "@utils/app/build-response";
// Schema
import authSchema from "@schemas/auth";
// Services
import authService from "@services/auth";

// --------------------------------------------------
// Controller
const sendResetPasswordController: Controller<
  typeof authSchema.sendResetPassword.params,
  typeof authSchema.sendResetPassword.body,
  typeof authSchema.sendResetPassword.query
> = async (req, res, next) => {
  try {
    const resetPassword = await authService.sendResetPassword({
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
