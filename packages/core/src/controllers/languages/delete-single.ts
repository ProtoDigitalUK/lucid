// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import languagesSchema from "@schemas/languages.js";
// Services
import languagesService from "@services/languages/index.js";

// --------------------------------------------------
// Controller
const deleteSingleController: Controller<
  typeof languagesSchema.deleteSingle.params,
  typeof languagesSchema.deleteSingle.body,
  typeof languagesSchema.deleteSingle.query
> = async (request, reply) => {
  const language = await service(
    languagesService.deleteSingle,
    false
  )({
    code: request.params.code,
  });

  reply.status(200).send(
    buildResponse(request, {
      data: language,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: languagesSchema.deleteSingle,
  controller: deleteSingleController,
};
