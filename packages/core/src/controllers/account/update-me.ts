// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import accountSchema from "@schemas/account";
// Services
import usersService from "@services/users";

// --------------------------------------------------
// Controller
const updateMeController: Controller<
  typeof accountSchema.updateMe.params,
  typeof accountSchema.updateMe.body,
  typeof accountSchema.updateMe.query
> = async (req, res, next) => {
  try {
    const userRoles = await service(
      usersService.updateSingle,
      true
    )({
      user_id: req.auth.id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
      role_ids: req.body.role_ids,
    });

    res.status(200).json(
      buildResponse(req, {
        data: userRoles,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: accountSchema.updateMe,
  controller: updateMeController,
};
