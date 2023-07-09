// Utils
import buildResponse from "@utils/controllers/build-response";
// Models
import Email from "@db/models/Email";
// Schema
import emailsSchema from "@schemas/email";

// --------------------------------------------------
// Controller
const getSingle: Controller<
  typeof emailsSchema.getSingle.params,
  typeof emailsSchema.getSingle.body,
  typeof emailsSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const email = await Email.getSingle(parseInt(req.params.id));

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
  schema: emailsSchema.getSingle,
  controller: getSingle,
};
