// Utils
import buildResponse from "@utils/controllers/build-response";
// Models
import Media from "@db/models/Media";
// Schema
import mediaSchema from "@schemas/media";

// --------------------------------------------------
// Controller
const updateSingle: Controller<
  typeof mediaSchema.updateSingle.params,
  typeof mediaSchema.updateSingle.body,
  typeof mediaSchema.updateSingle.query
> = async (req, res, next) => {
  try {
    const media = await Media.updateSingle(req.params.key, {
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
  schema: mediaSchema.updateSingle,
  controller: updateSingle,
};
