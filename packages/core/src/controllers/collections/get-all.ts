// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import collectionSchema from "@schemas/collections.js";
// Serives
import collectionsService from "@services/collections/index.js";

// --------------------------------------------------
// Controller
const getAllController: Controller<
  typeof collectionSchema.getAll.params,
  typeof collectionSchema.getAll.body,
  typeof collectionSchema.getAll.query
> = async (req, res, next) => {
  try {
    const collectionsRes = await service(
      collectionsService.getAll,
      false
    )({
      query: req.query,
    });

    res.status(200).json(
      buildResponse(req, {
        data: collectionsRes,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: collectionSchema.getAll,
  controller: getAllController,
};
