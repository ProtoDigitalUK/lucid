// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import authSchema from "@schemas/auth.js";
// Services
import usersService from "@services/users/index.js";

// --------------------------------------------------
// Controller
const getAuthenticatedUserController: Controller<
  typeof authSchema.getAuthenticatedUser.params,
  typeof authSchema.getAuthenticatedUser.body,
  typeof authSchema.getAuthenticatedUser.query
> = async (request, reply) => {
  const user = await service(
    usersService.getSingle,
    false
  )({
    user_id: request.auth.id,
  });

  reply.status(200).send(
    buildResponse(request, {
      data: user,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: authSchema.getAuthenticatedUser,
  controller: getAuthenticatedUserController,
};
