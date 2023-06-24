// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Collection from "@db/models/Collection";
// Schema
import collectionSchema from "@schemas/collections";

// --------------------------------------------------
// Controller
const getAll: Controller<
  typeof collectionSchema.getAll.params,
  typeof collectionSchema.getAll.body,
  typeof collectionSchema.getAll.query
> = async (req, res, next) => {
  try {
    const collections = await Collection.getAll(
      req.query,
      req.headers["lucid-environment"] as string
    );

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
  controller: getAll,
};
