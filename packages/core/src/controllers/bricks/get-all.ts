import z from "zod";
// Services
import buildResponse from "@services/controllers/build-response";
// Models
import BrickConfig from "@db/models/BrickConfig";

// --------------------------------------------------
// Schema
type Includes = "fields";

const body = z.object({});
const query = z.object({
  include: z.array(z.enum(["fields"])).optional(),
  filter: z
    .object({
      s: z.string(),
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
// query

// --------------------------------------------------
// Controller
const getAll: Controller<typeof params, typeof body, typeof query> = async (
  req,
  res,
  next
) => {
  try {
    const bricks = await BrickConfig.getAll(req, req.query);

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
