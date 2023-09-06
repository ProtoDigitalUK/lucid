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
> = async (req, res, next) => {
  try {
    const resetPassword = await service(
      authService.resetPassword,
      true
    )({
      token: req.params.token,
      password: req.body.password,
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
  schema: authSchema.resetPassword,
  controller: resetPasswordController,
};
