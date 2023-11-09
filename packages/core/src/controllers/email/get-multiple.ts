// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import emailsSchema from "@schemas/email.js";
// Services
import emailServices from "@services/email/index.js";

// --------------------------------------------------
// Controller
const getMultipleController: Controller<
  typeof emailsSchema.getMultiple.params,
  typeof emailsSchema.getMultiple.body,
  typeof emailsSchema.getMultiple.query
> = async (request, reply) => {
  const emailsRes = await service(
    emailServices.getMultiple,
    false
  )({
    query: request.query,
  });

  reply.status(200).send(
    buildResponse(request, {
      data: emailsRes.data,
      pagination: {
        count: emailsRes.count,
        page: request.query.page as string,
        per_page: request.query.per_page as string,
      },
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: emailsSchema.getMultiple,
  controller: getMultipleController,
};
