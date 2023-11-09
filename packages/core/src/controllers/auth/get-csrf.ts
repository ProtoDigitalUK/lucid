// Utils
import buildResponse from "@utils/app/build-response.js";
// Schema
import authSchema from "@schemas/auth.js";
// Services
import authService from "@services/auth/index.js";

// --------------------------------------------------
// Controller
const getCSRFController: Controller<
  typeof authSchema.getCSRF.params,
  typeof authSchema.getCSRF.body,
  typeof authSchema.getCSRF.query
> = async (request, reply) => {
  const token = authService.csrf.generateCSRFToken(reply);

  reply.status(200).send(
    buildResponse(request, {
      data: {
        _csrf: token,
      },
    })
  );
};

// --------------------------------------------------
// Export
export default {
  schema: authSchema.getCSRF,
  controller: getCSRFController,
};
