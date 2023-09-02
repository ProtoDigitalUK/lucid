// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import mediaSchema from "@schemas/media";
// Services
import mediaService from "@services/media";

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
