// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import formSubmissionsSchema from "@schemas/form-submissions.js";
// Services
import formSubService from "@services/form-submissions/index.js";

// --------------------------------------------------
// Controller
const getMultipleController: Controller<
  typeof formSubmissionsSchema.getMultiple.params,
  typeof formSubmissionsSchema.getMultiple.body,
  typeof formSubmissionsSchema.getMultiple.query
> = async (request, reply) => {
  const submissions = await service(
    formSubService.getMultiple,
    false
  )({
    query: request.query,
    form_key: request.params.form_key,
    environment_key: request.headers["headless-environment"] as string,
  });

  reply.status(200).send(
    buildResponse(request, {
      data: submissions.data,
      pagination: {
        count: submissions.count,
        page: request.query.page as string,
        per_page: request.query.per_page as string,
      },
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: formSubmissionsSchema.getMultiple,
  controller: getMultipleController,
};
