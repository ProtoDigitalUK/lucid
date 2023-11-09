// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import formsSchema from "@schemas/forms.js";
// Services
import formsService from "@services/forms/index.js";

// --------------------------------------------------
// Controller
const getAllController: Controller<
  typeof formsSchema.getAll.params,
  typeof formsSchema.getAll.body,
  typeof formsSchema.getAll.query
> = async (request, reply) => {
  const formsRes = await service(
    formsService.getAll,
    false
  )({
    query: request.query,
  });

  reply.status(200).send(
    buildResponse(request, {
      data: formsRes,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: formsSchema.getAll,
  controller: getAllController,
};
