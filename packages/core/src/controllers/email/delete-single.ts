// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Email from "@db/models/Email";
// Schema
import emailsSchema from "@schemas/email";

// --------------------------------------------------
// Controller
const deleteSingle: Controller<
  typeof emailsSchema.deleteSingle.params,
  typeof emailsSchema.deleteSingle.body,
  typeof emailsSchema.deleteSingle.query
> = async (req, res, next) => {
  try {
    const email = await Email.deleteSingle(parseInt(req.params.id));

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
  schema: emailsSchema.deleteSingle,
  controller: deleteSingle,
};
