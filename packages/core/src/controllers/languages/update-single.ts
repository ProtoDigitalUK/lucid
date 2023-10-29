// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import languagesSchema from "@schemas/languages.js";
// Services
import languagesService from "@services/languages/index.js";

// --------------------------------------------------
// Controller
const updateSingleController: Controller<
  typeof languagesSchema.updateSingle.params,
  typeof languagesSchema.updateSingle.body,
  typeof languagesSchema.updateSingle.query
> = async (req, res, next) => {
  try {
    const language = await service(
      languagesService.updateSingle,
      false
    )({
      code: req.params.code,
      data: {
        code: req.body.code,
        is_default: req.body.is_default,
        is_enabled: req.body.is_enabled,
      },
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
  schema: languagesSchema.updateSingle,
  controller: updateSingleController,
};
