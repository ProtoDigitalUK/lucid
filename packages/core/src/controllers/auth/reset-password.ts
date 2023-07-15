// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import authSchema from "@schemas/auth";
// Services
import authService from "@services/auth";

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
