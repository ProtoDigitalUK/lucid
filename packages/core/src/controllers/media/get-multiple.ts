// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import mediaSchema from "@schemas/media";
// Services
import getMultiple from "@services/media/get-multiple";

// --------------------------------------------------
// Controller
const getMultipleController: Controller<
  typeof mediaSchema.getMultiple.params,
  typeof mediaSchema.getMultiple.body,
  typeof mediaSchema.getMultiple.query
> = async (req, res, next) => {
  try {
    const medias = await getMultiple({
      query: req.query,
    });

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
  controller: getMultipleController,
};
