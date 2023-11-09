// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import emailsSchema from "@schemas/email.js";
// Serices
import emailServices from "@services/email/index.js";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof emailsSchema.getSingle.params,
  typeof emailsSchema.getSingle.body,
  typeof emailsSchema.getSingle.query
> = async (request, reply) => {
  const email = await service(
    emailServices.getSingle,
    false
  )({
    id: parseInt(request.params.id),
    renderTemplate: true,
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
  schema: emailsSchema.getSingle,
  controller: getSingleController,
};
