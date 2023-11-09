// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import usersSchema from "@schemas/users.js";
// Services
import usersService from "@services/users/index.js";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof usersSchema.getSingle.params,
  typeof usersSchema.getSingle.body,
  typeof usersSchema.getSingle.query
> = async (request, reply) => {
  const user = await service(
    usersService.getSingle,
    false
  )({
    user_id: parseInt(request.params.id),
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
  schema: usersSchema.getSingle,
  controller: getSingleController,
};
