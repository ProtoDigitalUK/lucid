// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import usersSchema from "@schemas/users.js";
// Services
import usersService from "@services/users/index.js";

// --------------------------------------------------
// Controller
const updateSingleController: Controller<
  typeof usersSchema.updateSingle.params,
  typeof usersSchema.updateSingle.body,
  typeof usersSchema.updateSingle.query
> = async (req, res, next) => {
  try {
    const userRoles = await service(usersService.updateSingle, true)(
      {
        user_id: parseInt(req.params.id),
        role_ids: req.body.role_ids,
        super_admin: req.body.super_admin,
      },
      req.auth.id
    );

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
  schema: usersSchema.updateSingle,
  controller: updateSingleController,
};
