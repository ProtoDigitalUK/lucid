import z from "zod";
// Services
import buildResponse from "@services/controllers/build-response";
// Models
import BrickConfig from "@db/models/BrickConfig";

// --------------------------------------------------
// Schema
const body = z.object({});
const query = z.object({
  include: z.array(z.enum(["fields"])).optional(),
  filter: z
    .object({
      s: z.string().optional(),
      collection_key: z.union([z.string(), z.array(z.string())]).optional(),
      environment_key: z.string().optional(),
    })
    .optional(),
  sort: z
    .array(
      z.object({
        key: z.enum(["name"]),
        value: z.enum(["asc", "desc"]),
      })
    )
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
    const bricks = await BrickConfig.getAll(
      req.query,
      req.headers["lucid-environment"] as string
    );

    res.status(200).json(
      buildResponse(req, {
        data: bricks,
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
