// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import accountSchema from "@schemas/account.js";
// Services
import usersService from "@services/users/index.js";

// --------------------------------------------------
// Controller
const updateMeController: Controller<
  typeof accountSchema.updateMe.params,
  typeof accountSchema.updateMe.body,
  typeof accountSchema.updateMe.query
> = async (request, reply) => {
  const userRoles = await service(usersService.updateSingle, false)(
    {
      user_id: request.auth.id,
      first_name: request.body.first_name,
      last_name: request.body.last_name,
      username: request.body.username,
      email: request.body.email,
      role_ids: request.body.role_ids,
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
  schema: accountSchema.updateMe,
  controller: updateMeController,
};
