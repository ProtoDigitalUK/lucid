// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import collectionSchema from "@schemas/collections";
// Serives
import getAll from "@services/collections/get-all";

// --------------------------------------------------
// Controller
const getAllController: Controller<
  typeof collectionSchema.getAll.params,
  typeof collectionSchema.getAll.body,
  typeof collectionSchema.getAll.query
> = async (req, res, next) => {
  try {
    const collections = await getAll({
      query: req.query,
      environment_key: req.headers["lucid-environment"] as string,
    });

    res.status(200).json(
      buildResponse(req, {
        data: collections,
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
