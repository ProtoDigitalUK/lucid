// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import usersSchema from "@schemas/users.js";
// Services
import usersService from "@services/users/index.js";

// --------------------------------------------------
// Controller
const deleteSingleController: Controller<
  typeof usersSchema.deleteSingle.params,
  typeof usersSchema.deleteSingle.body,
  typeof usersSchema.deleteSingle.query
> = async (request, reply) => {
  const user = await service(
    usersService.deleteSingle,
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
  schema: usersSchema.deleteSingle,
  controller: deleteSingleController,
};
