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
> = async (request, reply) => {
  const userRoles = await service(usersService.updateSingle, false)(
    {
      user_id: parseInt(request.params.id),
      role_ids: request.body.role_ids,
      super_admin: request.body.super_admin,
    },
    request.auth.id
  );

  reply.status(200).send(
    buildResponse(request, {
      data: userRoles,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: usersSchema.updateSingle,
  controller: updateSingleController,
};
