// Services
import buildResponse from "@services/controllers/build-response";
// Models
import SinglePage from "@db/models/SinglePage";
// Schema
import singlePageSchema from "@schemas/single-page";

// --------------------------------------------------
// Controller
const updateSingle: Controller<
  typeof singlePageSchema.updateSingle.params,
  typeof singlePageSchema.updateSingle.body,
  typeof singlePageSchema.updateSingle.query
> = async (req, res, next) => {
  try {
    const page = await SinglePage.updateSingle({
      userId: req.auth.id,
      environment_key: req.headers["lucid-environment"] as string,
      collection_key: req.params.collection_key,
      builder_bricks: req.body.builder_bricks,
      fixed_bricks: req.body.fixed_bricks,
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
  schema: singlePageSchema.updateSingle,
  controller: updateSingle,
};
