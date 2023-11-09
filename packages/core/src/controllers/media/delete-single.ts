// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import mediaSchema from "@schemas/media.js";
// Services
import mediaService from "@services/media/index.js";

// --------------------------------------------------
// Controller
const deleteSingleController: Controller<
  typeof mediaSchema.deleteSingle.params,
  typeof mediaSchema.deleteSingle.body,
  typeof mediaSchema.deleteSingle.query
> = async (request, reply) => {
  const media = await service(
    mediaService.deleteSingle,
    false
  )({
    id: parseInt(request.params.id),
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
  schema: mediaSchema.deleteSingle,
  controller: deleteSingleController,
};
