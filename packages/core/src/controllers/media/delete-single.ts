// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import mediaSchema from "@schemas/media.js";
// Services
import mediaService from "@services/media/index.js";

// --------------------------------------------------
// Controller
const deleteSingleController: Controller<
  typeof mediaSchema.deleteSingle.params,
  typeof mediaSchema.deleteSingle.body,
  typeof mediaSchema.deleteSingle.query
> = async (req, res, next) => {
  try {
    const media = await service(
      mediaService.deleteSingle,
      true
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
  schema: mediaSchema.deleteSingle,
  controller: deleteSingleController,
};
