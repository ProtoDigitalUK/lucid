// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import usersSchema from "@schemas/users.js";
// Services
import usersService from "@services/users/index.js";

// --------------------------------------------------
// Controller
const createSingleController: Controller<
  typeof usersSchema.createSingle.params,
  typeof usersSchema.createSingle.body,
  typeof usersSchema.createSingle.query
> = async (req, res, next) => {
  try {
    const user = await service(usersService.registerSingle, false)(
      {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        super_admin: req.body.super_admin,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        role_ids: req.body.role_ids,
      },
      req.auth.id
    );

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
  schema: usersSchema.createSingle,
  controller: createSingleController,
};
