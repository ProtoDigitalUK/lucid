// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Media from "@db/models/Media";
// Schema
import mediaSchema from "@schemas/media";

// --------------------------------------------------
// Controller
const getSingle: Controller<
  typeof mediaSchema.getSingle.params,
  typeof mediaSchema.getSingle.body,
  typeof mediaSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const media = await Media.getSingle(req.params.key);

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
  controller: getSingle,
};
