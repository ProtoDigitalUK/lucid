// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Page from "@db/models/Page";
// Schema
import pagesSchema from "@schemas/pages";

// --------------------------------------------------
// Controller
const getSingle: Controller<
  typeof pagesSchema.getSingle.params,
  typeof pagesSchema.getSingle.body,
  typeof pagesSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const page = await Page.getSingle(req.query, {
      environment_key: req.headers["lucid-environment"] as string,
      id: req.params.id,
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
  schema: pagesSchema.getSingle,
  controller: getSingle,
};
