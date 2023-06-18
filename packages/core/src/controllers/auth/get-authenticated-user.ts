// Services
import buildResponse from "@services/controllers/build-response";
// Models
import User from "@db/models/User";
// Schema
import authSchema from "@schemas/auth";

// --------------------------------------------------
// Controller
const getAuthenticatedUser: Controller<
  typeof authSchema.getAuthenticatedUser.params,
  typeof authSchema.getAuthenticatedUser.body,
  typeof authSchema.getAuthenticatedUser.query
> = async (req, res, next) => {
  try {
    const user = await User.getById(req.auth.id);

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
  controller: getAuthenticatedUser,
};
