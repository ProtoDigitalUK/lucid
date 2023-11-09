// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import rolesSchema from "@schemas/roles.js";
// Services
import rolesService from "@services/roles/index.js";

// --------------------------------------------------
// Controller
const updateSingleController: Controller<
  typeof rolesSchema.updateSingle.params,
  typeof rolesSchema.updateSingle.body,
  typeof rolesSchema.updateSingle.query
> = async (request, reply) => {
  const role = await service(
    rolesService.updateSingle,
    false
  )({
    id: parseInt(request.params.id),
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
  schema: rolesSchema.updateSingle,
  controller: updateSingleController,
};
