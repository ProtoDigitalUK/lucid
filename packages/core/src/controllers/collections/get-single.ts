// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import collectionSchema from "@schemas/collections";
// Services
import collections from "@services/collections";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof collectionSchema.getSingle.params,
  typeof collectionSchema.getSingle.body,
  typeof collectionSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const collectionsRes = await collections.getSingle({
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
  controller: getSingleController,
};
