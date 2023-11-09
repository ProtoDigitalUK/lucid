// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import usersSchema from "@schemas/users.js";
// Services
import usersService from "@services/users/index.js";

// --------------------------------------------------
// Controller
const getMultipleController: Controller<
  typeof usersSchema.getMultiple.params,
  typeof usersSchema.getMultiple.body,
  typeof usersSchema.getMultiple.query
> = async (request, reply) => {
  const user = await service(
    usersService.getMultiple,
    false
  )({
    query: request.query,
  });

  reply.status(200).send(
    buildResponse(request, {
      data: user.data,
      pagination: {
        count: user.count,
        page: request.query.page as string,
        per_page: request.query.per_page as string,
      },
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: usersSchema.getMultiple,
  controller: getMultipleController,
};
