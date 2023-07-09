// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Media from "@db/models/Media";
// Schema
import mediaSchema from "@schemas/media";

// --------------------------------------------------
// Controller
const getMultiple: Controller<
  typeof mediaSchema.getMultiple.params,
  typeof mediaSchema.getMultiple.body,
  typeof mediaSchema.getMultiple.query
> = async (req, res, next) => {
  try {
    const medias = await Media.getMultiple(req.query);

    res.status(200).json(
      buildResponse(req, {
        data: medias.data,
        pagination: {
          count: medias.count,
          page: req.query.page as string,
          per_page: req.query.per_page as string,
        },
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: mediaSchema.getMultiple,
  controller: getMultiple,
};
