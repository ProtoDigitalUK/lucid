// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Page from "@db/models/Page";
// Schema
import pagesSchema from "@schemas/pages";

// --------------------------------------------------
// Controller
const createSingle: Controller<
  typeof pagesSchema.createSingle.params,
  typeof pagesSchema.createSingle.body,
  typeof pagesSchema.createSingle.query
> = async (req, res, next) => {
  try {
    const page = await Page.createSingle({
      environment_key: req.headers["lucid-environment"] as string,
      title: req.body.title,
      slug: req.body.slug,
      collection_key: req.body.collection_key,
      homepage: req.body.homepage,
      excerpt: req.body.excerpt,
      published: req.body.published,
      parent_id: req.body.parent_id,
      category_ids: req.body.category_ids,
      userId: req.auth.id,
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
  schema: pagesSchema.createSingle,
  controller: createSingle,
};
