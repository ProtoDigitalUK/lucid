// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
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
    const email = await service(
      emailsService.getSingle,
      false
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
  schema: emailsSchema.getSingle,
  controller: getSingleController,
};
