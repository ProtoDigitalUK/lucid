// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import mediaSchema from "@schemas/media.js";
// Services
import mediaService from "@services/media/index.js";

// --------------------------------------------------
// Controller
const updateSingleFileController: Controller<
  typeof mediaSchema.updateSingleFile.params,
  typeof mediaSchema.updateSingleFile.body,
  typeof mediaSchema.updateSingleFile.query
> = async (request, reply) => {
  const media = await service(
    mediaService.updateSingleFile,
    true
  )({
    id: Number(request.params.id),
    fileData: await request.file(),
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
  schema: mediaSchema.updateSingleFile,
  controller: updateSingleFileController,
};
