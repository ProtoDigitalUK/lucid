// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import mediaSchema from "@schemas/media.js";
// Services
import mediaService from "@services/media/index.js";

// --------------------------------------------------
// Controller
const createSingleController: Controller<
  typeof mediaSchema.createSingle.params,
  typeof mediaSchema.createSingle.body,
  typeof mediaSchema.createSingle.query
> = async (request, reply) => {
  await service(
    mediaService.createSingle,
    true
  )({
    translations: request.body.translations,
    fileData: await request.file(),
  });

  reply.status(200).send(
    buildResponse(request, {
      data: undefined,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: mediaSchema.createSingle,
  controller: createSingleController,
};
