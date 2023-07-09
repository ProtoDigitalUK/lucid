// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import authSchema from "@schemas/auth";
// Services
import auth from "@services/auth";

// --------------------------------------------------
// Controller
const getAuthenticatedUserController: Controller<
  typeof authSchema.getAuthenticatedUser.params,
  typeof authSchema.getAuthenticatedUser.body,
  typeof authSchema.getAuthenticatedUser.query
> = async (req, res, next) => {
  try {
    const user = await auth.getAuthenticatedUser({
      userId: req.auth.id,
    });

    res.status(200).json(
      buildResponse(req, {
        data: user,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: authSchema.getAuthenticatedUser,
  controller: getAuthenticatedUserController,
};
