// Services
import buildResponse from "@services/controllers/build-response";
// Models
import UserRole from "@db/models/UserRole";
// Schema
import usersSchema from "@schemas/users";

// --------------------------------------------------
// Controller
const updateRoles: Controller<
  typeof usersSchema.updateRoles.params,
  typeof usersSchema.updateRoles.body,
  typeof usersSchema.updateRoles.query
> = async (req, res, next) => {
  try {
    const userRoles = await UserRole.update(req.params.id, {
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
  controller: updateRoles,
};
