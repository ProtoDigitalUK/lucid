// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import rolesSchema from "@schemas/roles.js";
// Services
import rolesService from "@services/roles/index.js";

// --------------------------------------------------
// Controller
const getMultipleController: Controller<
  typeof rolesSchema.getMultiple.params,
  typeof rolesSchema.getMultiple.body,
  typeof rolesSchema.getMultiple.query
> = async (request, reply) => {
  const rolesRes = await service(
    rolesService.getMultiple,
    false
  )({
    query: request.query,
  });

  reply.status(200).send(
    buildResponse(request, {
      data: rolesRes.data,
      pagination: {
        count: rolesRes.count,
        page: request.query.page as string,
        per_page: request.query.per_page as string,
      },
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: rolesSchema.getMultiple,
  controller: getMultipleController,
};
