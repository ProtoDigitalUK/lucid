// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import environmentSchema from "@schemas/environments.js";
// Services
import environmentsService from "@services/environments/index.js";

// --------------------------------------------------
// Controller
const createSingleController: Controller<
  typeof environmentSchema.createSingle.params,
  typeof environmentSchema.createSingle.body,
  typeof environmentSchema.createSingle.query
> = async (request, reply) => {
  const environment = await service(
    environmentsService.upsertSingle,
    false
  )({
    data: {
      key: request.body.key,
      title: request.body.title,
      assigned_bricks: request.body.assigned_bricks,
      assigned_collections: request.body.assigned_collections,
      assigned_forms: request.body.assigned_forms,
    },
    create: true,
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
  schema: environmentSchema.createSingle,
  controller: createSingleController,
};
