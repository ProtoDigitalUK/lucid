import z from "zod";
// Schema
import { BrickSchema } from "@schemas/bricks";
// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Page from "@db/models/Page";

// --------------------------------------------------
// Schema
const body = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  homepage: z.boolean().optional(),
  parent_id: z.number().optional(),
  category_ids: z.array(z.number()).optional(),
  published: z.boolean().optional(),
  excerpt: z.string().optional(),
  bricks: z.array(BrickSchema).optional(),
});
const query = z.object({});
const params = z.object({
  id: z.string(),
});

// --------------------------------------------------
// Controller
const updateSingle: Controller<
  typeof params,
  typeof body,
  typeof query
> = async (req, res, next) => {
  try {
    const page = await Page.update(
      req.params.id,
      {
        title: req.body.title,
        slug: req.body.slug,
        homepage: req.body.homepage,
        parent_id: req.body.parent_id,
        category_ids: req.body.category_ids,
        published: req.body.published,
        excerpt: req.body.excerpt,
        bricks: req.body.bricks,
      },
      req
    );

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
  schema: {
    body,
    query,
    params,
  },
  controller: updateSingle,
};
