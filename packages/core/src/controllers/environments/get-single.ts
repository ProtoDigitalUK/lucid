// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import environmentSchema from "@schemas/environments.js";
// Services
import environmentsService from "@services/environments/index.js";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof environmentSchema.getSingle.params,
  typeof environmentSchema.getSingle.body,
  typeof environmentSchema.getSingle.query
> = async (request, reply) => {
  const environment = await service(
    environmentsService.getSingle,
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
  schema: environmentSchema.getSingle,
  controller: getSingleController,
};
