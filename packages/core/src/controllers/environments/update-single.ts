// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import environmentSchema from "@schemas/environments.js";
// Services
import environmentsService from "@services/environments/index.js";

// --------------------------------------------------
// Controller
const updateSingleController: Controller<
  typeof environmentSchema.updateSingle.params,
  typeof environmentSchema.updateSingle.body,
  typeof environmentSchema.updateSingle.query
> = async (request, reply) => {
  const environment = await service(
    environmentsService.upsertSingle,
    false
  )({
    data: {
      key: request.params.key,
      title: request.body.title,
      assigned_bricks: request.body.assigned_bricks,
      assigned_collections: request.body.assigned_collections,
      assigned_forms: request.body.assigned_forms,
    },
    create: false,
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
  schema: environmentSchema.updateSingle,
  controller: updateSingleController,
};
