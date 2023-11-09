// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import rolesSchema from "@schemas/roles.js";
// Services
import rolesService from "@services/roles/index.js";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof rolesSchema.getSingle.params,
  typeof rolesSchema.getSingle.body,
  typeof rolesSchema.getSingle.query
> = async (request, reply) => {
  const role = await service(
    rolesService.getSingle,
    false
  )({
    id: parseInt(request.params.id),
  });

  reply.status(200).send(
    buildResponse(request, {
      data: role,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: rolesSchema.getSingle,
  controller: getSingleController,
};
