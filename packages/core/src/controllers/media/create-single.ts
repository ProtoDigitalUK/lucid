// Utils
import buildResponse from "@utils/controllers/build-response";
// Models
import Media from "@db/models/Media";
// Schema
import mediaSchema from "@schemas/media";

// --------------------------------------------------
// Controller
const createSingle: Controller<
  typeof mediaSchema.createSingle.params,
  typeof mediaSchema.createSingle.body,
  typeof mediaSchema.createSingle.query
> = async (req, res, next) => {
  try {
    const media = await Media.createSingle({
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
  controller: createSingle,
};
