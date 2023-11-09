// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import environmentSchema from "@schemas/environments.js";
// Services
import environmentsService from "@services/environments/index.js";

// --------------------------------------------------
// Controller
const deleteSingleController: Controller<
  typeof environmentSchema.deleteSingle.params,
  typeof environmentSchema.deleteSingle.body,
  typeof environmentSchema.deleteSingle.query
> = async (request, reply) => {
  const environment = await service(
    environmentsService.deleteSingle,
    false
  )({
    key: request.params.key,
  });

  reply.status(200).send(
    buildResponse(request, {
      data: environment,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: environmentSchema.deleteSingle,
  controller: deleteSingleController,
};
