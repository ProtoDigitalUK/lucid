// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import formsSchema from "@schemas/forms.js";
// Services
import formsService from "@services/forms/index.js";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof formsSchema.getSingle.params,
  typeof formsSchema.getSingle.body,
  typeof formsSchema.getSingle.query
> = async (request, reply) => {
  const form = await service(
    formsService.getSingle,
    false
  )({
    key: request.params.form_key,
    environment_key: request.headers["headless-environment"] as string,
  });

  reply.status(200).send(
    buildResponse(request, {
      data: form,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: formsSchema.getSingle,
  controller: getSingleController,
};
