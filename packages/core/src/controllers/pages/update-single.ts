// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Page from "@db/models/Page";
// Schema
import pagesSchema from "@schemas/pages";

// --------------------------------------------------
// Controller
const updateSingle: Controller<
  typeof pagesSchema.updateSingle.params,
  typeof pagesSchema.updateSingle.body,
  typeof pagesSchema.updateSingle.query
> = async (req, res, next) => {
  try {
    const page = await Page.update({
      id: req.params.id,
      environment_key: req.headers["lucid-environment"] as string,
      userId: req.auth.id,

      title: req.body.title,
      slug: req.body.slug,
      homepage: req.body.homepage,
      parent_id: req.body.parent_id,
      category_ids: req.body.category_ids,
      published: req.body.published,
      excerpt: req.body.excerpt,
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
  schema: pagesSchema.updateSingle,
  controller: updateSingle,
};
