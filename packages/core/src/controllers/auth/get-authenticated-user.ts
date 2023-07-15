// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import authSchema from "@schemas/auth";
// Services
import usersService from "@services/users";

// --------------------------------------------------
// Controller
const getAuthenticatedUserController: Controller<
  typeof authSchema.getAuthenticatedUser.params,
  typeof authSchema.getAuthenticatedUser.body,
  typeof authSchema.getAuthenticatedUser.query
> = async (req, res, next) => {
  try {
    const user = await service(
      usersService.getSingle,
      false
    )({
      user_id: req.auth.id,
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
