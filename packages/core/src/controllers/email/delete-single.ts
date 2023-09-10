// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import emailsSchema from "@schemas/email.js";
// Services
import emailService from "@services/email/index.js";

// --------------------------------------------------
// Controller
const deleteSingleController: Controller<
  typeof emailsSchema.deleteSingle.params,
  typeof emailsSchema.deleteSingle.body,
  typeof emailsSchema.deleteSingle.query
> = async (req, res, next) => {
  try {
    const email = await service(
      emailService.deleteSingle,
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
  schema: emailsSchema.deleteSingle,
  controller: deleteSingleController,
};
