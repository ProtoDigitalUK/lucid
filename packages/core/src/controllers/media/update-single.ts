// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import mediaSchema from "@schemas/media";
// Services
import updateSingle from "@services/media/update-single";

// --------------------------------------------------
// Controller
const updateSingleController: Controller<
  typeof mediaSchema.updateSingle.params,
  typeof mediaSchema.updateSingle.body,
  typeof mediaSchema.updateSingle.query
> = async (req, res, next) => {
  try {
    const media = await updateSingle({
      key: req.params.key,
      data: {
        name: req.body.name,
        alt: req.body.alt,
        files: req.files,
      },
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
  controller: updateSingleController,
};
