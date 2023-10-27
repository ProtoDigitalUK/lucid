// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import languagesSchema from "@schemas/languages.js";
// Services
import languagesService from "@services/languages/index.js";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof languagesSchema.getSingle.params,
  typeof languagesSchema.getSingle.body,
  typeof languagesSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const language = await service(
      languagesService.getSingle,
      false
    )({
      code: req.params.code,
    });

    res.status(200).json(
      buildResponse(req, {
        data: language,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: languagesSchema.getSingle,
  controller: getSingleController,
};
