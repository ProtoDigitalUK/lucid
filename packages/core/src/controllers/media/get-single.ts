// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import mediaSchema from "@schemas/media.js";
// Services
import mediaService from "@services/media/index.js";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof mediaSchema.getSingle.params,
  typeof mediaSchema.getSingle.body,
  typeof mediaSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const media = await service(
      mediaService.getSingle,
      false
    )({
      id: parseInt(req.params.id),
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
  schema: mediaSchema.getSingle,
  controller: getSingleController,
};
