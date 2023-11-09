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
> = async (request, reply) => {
  const user = await service(usersService.registerSingle, false)(
    {
      email: request.body.email,
      username: request.body.username,
      password: request.body.password,
      super_admin: request.body.super_admin,
      first_name: request.body.first_name,
      last_name: request.body.last_name,
      role_ids: request.body.role_ids,
    },
    request.auth.id
  );

  reply.status(200).send(
    buildResponse(request, {
      data: user,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: usersSchema.createSingle,
  controller: createSingleController,
};
