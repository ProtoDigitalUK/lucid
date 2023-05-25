import z from "zod";
// Services
import buildResponse from "@services/controllers/build-response";
// Models
import BrickConfig from "@db/models/BrickConfig";

// --------------------------------------------------
// Schema
const body = z.object({});
const query = z.object({});
const params = z.object({});

// --------------------------------------------------
// Controller
const getAll: Controller<typeof params, typeof body, typeof query> = async (
  req,
  res,
  next
) => {
  try {
    const bricks = await BrickConfig.getAll(req);

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
