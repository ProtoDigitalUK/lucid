// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import mediaSchema from "@schemas/media.js";
// Services
import mediaService from "@services/media/index.js";

// --------------------------------------------------
// Controller
const uploadSingleFileController: Controller<
  typeof mediaSchema.uploadSingleFile.params,
  typeof mediaSchema.uploadSingleFile.body,
  typeof mediaSchema.uploadSingleFile.query
> = async (request, reply) => {
  const media = await service(
    mediaService.uploadSingleFile,
    true
  )({
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
  schema: mediaSchema.uploadSingleFile,
  controller: uploadSingleFileController,
};
