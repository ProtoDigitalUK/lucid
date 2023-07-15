// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import collectionSchema from "@schemas/collections";
// Serives
import collectionsService from "@services/collections";

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
      environment_key: req.headers["lucid-environment"] as string,
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
