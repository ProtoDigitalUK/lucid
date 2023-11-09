// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import formSubmissionsSchema from "@schemas/form-submissions.js";
// Services
import formSubService from "@services/form-submissions/index.js";

// --------------------------------------------------
// Controller
const deleteSingleController: Controller<
  typeof formSubmissionsSchema.deleteSingle.params,
  typeof formSubmissionsSchema.deleteSingle.body,
  typeof formSubmissionsSchema.deleteSingle.query
> = async (request, reply) => {
  const formSubmission = await service(
    formSubService.deleteSingle,
    false
  )({
    id: parseInt(request.params.id),
    form_key: request.params.form_key,
    environment_key: request.headers["lucid-environment"] as string,
  });

  reply.status(200).send(
    buildResponse(request, {
      data: formSubmission,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: formSubmissionsSchema.deleteSingle,
  controller: deleteSingleController,
};
