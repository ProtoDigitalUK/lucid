// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import emailsSchema from "@schemas/email";
// Services
import deleteSingle from "@services/email/delete-single";

// --------------------------------------------------
// Controller
const deleteSingleController: Controller<
  typeof emailsSchema.deleteSingle.params,
  typeof emailsSchema.deleteSingle.body,
  typeof emailsSchema.deleteSingle.query
> = async (req, res, next) => {
  try {
    const email = await deleteSingle({
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
  schema: emailsSchema.deleteSingle,
  controller: deleteSingleController,
};
