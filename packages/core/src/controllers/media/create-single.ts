// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import mediaSchema from "@schemas/media.js";
// Services
import mediaService from "@services/media/index.js";

// --------------------------------------------------
// Controller
const createSingleController: Controller<
  typeof mediaSchema.createSingle.params,
  typeof mediaSchema.createSingle.body,
  typeof mediaSchema.createSingle.query
> = async (req, res, next) => {
  try {
    const media = await service(
      mediaService.createSingle,
      true
    )({
      translations: [
        {
          language_id: 1,
          name: "EN Name",
          alt: "EN Alt",
        },
        {
          language_id: 2,
          name: "ENGB Name",
          alt: "ENGB Alt",
        },
      ], // req.body.translations,
      files: req.files,
    });

    res.status(200).json(
      buildResponse(req, {
        data: media,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: mediaSchema.createSingle,
  controller: createSingleController,
};
