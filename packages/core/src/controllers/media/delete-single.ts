// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import mediaSchema from "@schemas/media";
// Services
import deleteSingle from "@services/media/delete-single";

// --------------------------------------------------
// Controller
const deleteSingleController: Controller<
  typeof mediaSchema.deleteSingle.params,
  typeof mediaSchema.deleteSingle.body,
  typeof mediaSchema.deleteSingle.query
> = async (req, res, next) => {
  try {
    const media = await deleteSingle({
      key: req.params.key,
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
