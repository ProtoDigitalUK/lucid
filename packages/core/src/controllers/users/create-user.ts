// Utils
import buildResponse from "@utils/app/build-response";
// Schema
import usersSchema from "@schemas/users";
// Services
import usersService from "@services/users";

// --------------------------------------------------
// Controller
const createUserController: Controller<
  typeof usersSchema.createUser.params,
  typeof usersSchema.createUser.body,
  typeof usersSchema.createUser.query
> = async (req, res, next) => {
  try {
    const user = await usersService.registerSingle(
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
  schema: usersSchema.createUser,
  controller: createUserController,
};
