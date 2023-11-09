// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import mediaSchema from "@schemas/media.js";
// Services
import mediaService from "@services/media/index.js";

// --------------------------------------------------
// Controller
const updateSingleController: Controller<
  typeof mediaSchema.updateSingle.params,
  typeof mediaSchema.updateSingle.body,
  typeof mediaSchema.updateSingle.query
> = async (request, reply) => {
  const media = await service(
    mediaService.updateSingle,
    false
  )({
    id: parseInt(request.params.id),
    data: {
      translations: request.body.translations,
      fileData: await request.file(),
    },
  });

  reply.status(200).send(
    buildResponse(request, {
      data: media,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: mediaSchema.updateSingle,
  controller: updateSingleController,
};
