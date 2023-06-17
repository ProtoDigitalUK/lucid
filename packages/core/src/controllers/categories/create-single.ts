import z from "zod";
// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Category from "@db/models/Category";

// --------------------------------------------------
// Schema
const body = z.object({
  collection_key: z.string(),
  title: z.string(),
  slug: z.string().min(2).toLowerCase(),
  description: z.string().optional(),
});
const query = z.object({});
const params = z.object({});

// --------------------------------------------------
// Controller
const createSingle: Controller<
  typeof params,
  typeof body,
  typeof query
> = async (req, res, next) => {
  try {
    const category = await Category.create(
      {
        collection_key: req.body.collection_key,
        title: req.body.title,
        slug: req.body.slug,
        description: req.body.description,
      },
      req
    );

    res.status(200).json(
      buildResponse(req, {
        data: category,
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
  controller: createSingle,
};
