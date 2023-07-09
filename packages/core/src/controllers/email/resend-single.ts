// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import emailsSchema from "@schemas/email";
// Services
import resendSingle from "@services/email/resend-single";

// --------------------------------------------------
// Controller
const resendSingleController: Controller<
  typeof emailsSchema.resendSingle.params,
  typeof emailsSchema.resendSingle.body,
  typeof emailsSchema.resendSingle.query
> = async (req, res, next) => {
  try {
    const email = await resendSingle({
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
