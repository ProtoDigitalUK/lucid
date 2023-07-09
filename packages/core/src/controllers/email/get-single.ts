// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import emailsSchema from "@schemas/email";
// Serices
import getSingle from "@services/email/get-single";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof emailsSchema.getSingle.params,
  typeof emailsSchema.getSingle.body,
  typeof emailsSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const email = await getSingle({
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
  schema: emailsSchema.getSingle,
  controller: getSingleController,
};
