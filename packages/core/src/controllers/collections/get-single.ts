// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Collection from "@db/models/Collection";
// Schema
import collectionSchema from "@schemas/collections";

// --------------------------------------------------
// Controller
const getSingle: Controller<
  typeof collectionSchema.getSingle.params,
  typeof collectionSchema.getSingle.body,
  typeof collectionSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const collections = await Collection.getSingle({
      collection_key: req.params.collection_key,
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
  schema: collectionSchema.getSingle,
  controller: getSingle,
};
