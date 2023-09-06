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
> = async (req, res, next) => {
  try {
    const verifyResetPassword = await service(
      authService.verifyResetPassword,
      false
    )({
      token: req.params.token,
    });

    res.status(200).json(
      buildResponse(req, {
        data: verifyResetPassword,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: authSchema.verifyResetPassword,
  controller: verifyResetPasswordController,
};
