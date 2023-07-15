// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import usersSchema from "@schemas/users";
// Services
import usersService from "@services/users";

// --------------------------------------------------
// Controller
const updateRolesController: Controller<
  typeof usersSchema.updateRoles.params,
  typeof usersSchema.updateRoles.body,
  typeof usersSchema.updateRoles.query
> = async (req, res, next) => {
  try {
    const userRoles = await service(
      usersService.updateRoles,
      true
    )({
      user_id: parseInt(req.params.id),
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
  schema: usersSchema.updateRoles,
  controller: updateRolesController,
};
