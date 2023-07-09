// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Page from "@db/models/Page";
// Schema
import pagesSchema from "@schemas/pages";

// --------------------------------------------------
// Controller
const deleteSingle: Controller<
  typeof pagesSchema.deleteSingle.params,
  typeof pagesSchema.deleteSingle.body,
  typeof pagesSchema.deleteSingle.query
> = async (req, res, next) => {
  try {
    const page = await Page.deleteSingle({
      id: req.params.id,
      environment_key: req.headers["lucid-environment"] as string,
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
  schema: pagesSchema.deleteSingle,
  controller: deleteSingle,
};
