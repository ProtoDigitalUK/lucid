import z from "zod";
// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Category from "@db/models/Category";

// --------------------------------------------------
// Schema
const body = z.object({
  title: z.string().optional(),
  slug: z.string().min(2).toLowerCase().optional(),
  description: z.string().optional(),
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
    const category = await Category.update(
      parseInt(req.params.id),
      {
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
  controller: updateSingle,
};
