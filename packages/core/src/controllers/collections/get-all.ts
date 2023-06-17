import z from "zod";
// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Collection from "@db/models/Collection";

// --------------------------------------------------
// Schema
const body = z.object({});
const query = z.object({
  filter: z
    .object({
      type: z.enum(["pages", "group"]).optional(),
      environment_key: z.string().optional(),
    })
    .optional(),
});
const params = z.object({});

// --------------------------------------------------
// Controller
const getAll: Controller<typeof params, typeof body, typeof query> = async (
  req,
  res,
  next
) => {
  try {
    const collections = await Collection.getAll(req.query);

    res.status(200).json(
      buildResponse(req, {
        data: collections,
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
  controller: getAll,
};
