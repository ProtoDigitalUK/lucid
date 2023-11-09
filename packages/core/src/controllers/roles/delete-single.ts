// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import rolesSchema from "@schemas/roles.js";
// Services
import rolesService from "@services/roles/index.js";

// --------------------------------------------------
// Controller
const deleteSingleController: Controller<
  typeof rolesSchema.deleteSingle.params,
  typeof rolesSchema.deleteSingle.body,
  typeof rolesSchema.deleteSingle.query
> = async (request, reply) => {
  const role = await service(
    rolesService.deleteSingle,
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
  schema: rolesSchema.deleteSingle,
  controller: deleteSingleController,
};
