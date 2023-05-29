import z from "zod";
// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Category from "@db/models/Category";

// --------------------------------------------------
// Schema
const body = z.object({});
const query = z.object({});
const params = z.object({
  id: z.string(),
});

// --------------------------------------------------
// Controller
const deleteSingle: Controller<
  typeof params,
  typeof body,
  typeof query
> = async (req, res, next) => {
  try {
    const category = await Category.delete(parseInt(req.params.id));

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
  controller: deleteSingle,
};
