// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Media from "@db/models/Media";
// Schema
import mediaSchema from "@schemas/media";

// --------------------------------------------------
// Controller
const deleteSingle: Controller<
  typeof mediaSchema.deleteSingle.params,
  typeof mediaSchema.deleteSingle.body,
  typeof mediaSchema.deleteSingle.query
> = async (req, res, next) => {
  try {
    const media = await Media.deleteSingle(req.params.key);

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
  controller: deleteSingle,
};
