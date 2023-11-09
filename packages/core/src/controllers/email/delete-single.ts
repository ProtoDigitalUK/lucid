// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import emailsSchema from "@schemas/email.js";
// Services
import emailServices from "@services/email/index.js";

// --------------------------------------------------
// Controller
const deleteSingleController: Controller<
  typeof emailsSchema.deleteSingle.params,
  typeof emailsSchema.deleteSingle.body,
  typeof emailsSchema.deleteSingle.query
> = async (request, reply) => {
  const email = await service(
    emailServices.deleteSingle,
    false
  )({
    id: parseInt(request.params.id),
  });

  reply.status(200).send(
    buildResponse(request, {
      data: email,
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: emailsSchema.deleteSingle,
  controller: deleteSingleController,
};
