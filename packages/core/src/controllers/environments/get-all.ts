// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import environmentSchema from "@schemas/environments.js";
// Services
import environmentsService from "@services/environments/index.js";

// --------------------------------------------------
// Controller
const getAllController: Controller<
  typeof environmentSchema.getAll.params,
  typeof environmentSchema.getAll.body,
  typeof environmentSchema.getAll.query
> = async (request, reply) => {
  const environmentsRes = await service(environmentsService.getAll, false)();

  reply.status(200).send(
    buildResponse(request, {
      data: environmentsRes,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: environmentSchema.getAll,
  controller: getAllController,
};
