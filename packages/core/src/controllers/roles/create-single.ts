// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import rolesSchema from "@schemas/roles.js";
// Services
import rolesService from "@services/roles/index.js";

// --------------------------------------------------
// Controller
const createSingleController: Controller<
  typeof rolesSchema.createSingle.params,
  typeof rolesSchema.createSingle.body,
  typeof rolesSchema.createSingle.query
> = async (request, reply) => {
  const role = await service(
    rolesService.createSingle,
    false
  )({
    name: request.body.name,
    permission_groups: request.body.permission_groups,
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
  schema: rolesSchema.createSingle,
  controller: createSingleController,
};
