// Utils
import buildResponse from "@utils/controllers/build-response";
// Models
import SinglePage from "@db/models/SinglePage";
// Schema
import singlePageSchema from "@schemas/single-page";

// --------------------------------------------------
// Controller
const getSingle: Controller<
  typeof singlePageSchema.getSingle.params,
  typeof singlePageSchema.getSingle.body,
  typeof singlePageSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const page = await SinglePage.getSingle({
      environment_key: req.headers["lucid-environment"] as string,
      collection_key: req.params.collection_key,
    });

    res.status(200).json(
      buildResponse(req, {
        data: page,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: singlePageSchema.getSingle,
  controller: getSingle,
};
