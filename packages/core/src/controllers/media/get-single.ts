// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import mediaSchema from "@schemas/media";
// Services
import getSingle from "@services/media/get-single";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof mediaSchema.getSingle.params,
  typeof mediaSchema.getSingle.body,
  typeof mediaSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const media = await getSingle({
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
  schema: mediaSchema.getSingle,
  controller: getSingleController,
};
