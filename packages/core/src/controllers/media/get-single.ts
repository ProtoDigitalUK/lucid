// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import mediaSchema from "@schemas/media.js";
// Services
import mediaService from "@services/media/index.js";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof mediaSchema.getSingle.params,
  typeof mediaSchema.getSingle.body,
  typeof mediaSchema.getSingle.query
> = async (request, reply) => {
  const media = await service(
    mediaService.getSingle,
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
  schema: mediaSchema.getSingle,
  controller: getSingleController,
};
