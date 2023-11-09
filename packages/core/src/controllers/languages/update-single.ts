// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import languagesSchema from "@schemas/languages.js";
// Services
import languagesService from "@services/languages/index.js";

// --------------------------------------------------
// Controller
const updateSingleController: Controller<
  typeof languagesSchema.updateSingle.params,
  typeof languagesSchema.updateSingle.body,
  typeof languagesSchema.updateSingle.query
> = async (request, reply) => {
  const language = await service(
    languagesService.updateSingle,
    false
  )({
    code: request.params.code,
    data: {
      code: request.body.code,
      is_default: request.body.is_default,
      is_enabled: request.body.is_enabled,
    },
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
  schema: languagesSchema.updateSingle,
  controller: updateSingleController,
};
