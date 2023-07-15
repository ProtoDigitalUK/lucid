// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import mediaSchema from "@schemas/media";
// Services
import mediaService from "@services/media";

// --------------------------------------------------
// Controller
const getMultipleController: Controller<
  typeof mediaSchema.getMultiple.params,
  typeof mediaSchema.getMultiple.body,
  typeof mediaSchema.getMultiple.query
> = async (req, res, next) => {
  try {
    const mediasRes = await service(
      mediaService.getMultiple,
      false
    )({
      query: req.query,
    });

    res.status(200).json(
      buildResponse(req, {
        data: mediasRes.data,
        pagination: {
          count: mediasRes.count,
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
