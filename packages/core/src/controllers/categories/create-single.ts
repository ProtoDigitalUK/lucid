import z from "zod";
// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Category from "@db/models/Category";

// --------------------------------------------------
// Schema
const body = z.object({
  post_type_id: z.number().int(),
  title: z.string(),
  slug: z.string().toLowerCase(),
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
    const category = await Category.create({
      post_type_id: req.body.post_type_id,
      title: req.body.title,
      slug: req.body.slug,
      description: req.body.description,
    });

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
