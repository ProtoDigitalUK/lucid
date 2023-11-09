// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import emailsSchema from "@schemas/email.js";
// Services
import emailServices from "@services/email/index.js";

// --------------------------------------------------
// Controller
const resendSingleController: Controller<
  typeof emailsSchema.resendSingle.params,
  typeof emailsSchema.resendSingle.body,
  typeof emailsSchema.resendSingle.query
> = async (request, reply) => {
  const email = await service(
    emailServices.resendSingle,
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
  schema: emailsSchema.resendSingle,
  controller: resendSingleController,
};
