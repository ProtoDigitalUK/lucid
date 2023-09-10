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
> = async (req, res, next) => {
  try {
    const email = await service(
      emailServices.resendSingle,
      true
    )({
      id: parseInt(req.params.id),
    });

    res.status(200).json(
      buildResponse(req, {
        data: email,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: emailsSchema.resendSingle,
  controller: resendSingleController,
};
