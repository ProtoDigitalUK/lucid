// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import languagesSchema from "@schemas/languages.js";
// Services
import languagesService from "@services/languages/index.js";

// --------------------------------------------------
// Controller
const createSingleController: Controller<
  typeof languagesSchema.createSingle.params,
  typeof languagesSchema.createSingle.body,
  typeof languagesSchema.createSingle.query
> = async (request, reply) => {
  const language = await service(
    languagesService.createSingle,
    false
  )({
    code: request.body.code,
    is_default: request.body.is_default,
    is_enabled: request.body.is_enabled,
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
  schema: languagesSchema.createSingle,
  controller: createSingleController,
};
