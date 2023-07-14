// Utils
import buildResponse from "@utils/app/build-response";
// Schema
import authSchema from "@schemas/auth";
// Services
import authService from "@services/auth";

// --------------------------------------------------
// Controller
const forgotPasswordController: Controller<
  typeof authSchema.forgotPassword.params,
  typeof authSchema.forgotPassword.body,
  typeof authSchema.forgotPassword.query
> = async (req, res, next) => {
  try {
    const forgotPassword = await authService.forgotPassword({
      email: req.body.email,
    });

    res.status(200).json(
      buildResponse(req, {
        data: {
          message: forgotPassword,
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
  schema: authSchema.forgotPassword,
  controller: forgotPasswordController,
};
