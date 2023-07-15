// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import mediaSchema from "@schemas/media";
// Services
import mediaService from "@services/media";

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
      name: req.body.name,
      alt: req.body.alt,
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
