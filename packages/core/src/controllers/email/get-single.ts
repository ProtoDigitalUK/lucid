// Utils
import buildResponse from "@utils/app/build-response";
// Schema
import emailsSchema from "@schemas/email";
// Serices
import emailsService from "@services/email";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof emailsSchema.getSingle.params,
  typeof emailsSchema.getSingle.body,
  typeof emailsSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const email = await emailsService.getSingle({
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
