// Utils
import buildResponse from "@utils/controllers/build-response";
// Models
import Email from "@db/models/Email";
// Schema
import emailsSchema from "@schemas/email";

// --------------------------------------------------
// Controller
const resendSingle: Controller<
  typeof emailsSchema.resendSingle.params,
  typeof emailsSchema.resendSingle.body,
  typeof emailsSchema.resendSingle.query
> = async (req, res, next) => {
  try {
    const email = await Email.resendSingle(parseInt(req.params.id));

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
  controller: resendSingle,
};
