// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import languagesSchema from "@schemas/languages.js";
// Services
import languagesService from "@services/languages/index.js";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof languagesSchema.getSingle.params,
  typeof languagesSchema.getSingle.body,
  typeof languagesSchema.getSingle.query
> = async (request, reply) => {
  const language = await service(
    languagesService.getSingle,
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
  schema: languagesSchema.getSingle,
  controller: getSingleController,
};
