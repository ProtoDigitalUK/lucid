import z from "zod";
// Services
import buildResponse from "@services/controllers/build-response";
// Models
import BrickConfig from "@db/models/BrickConfig";

// --------------------------------------------------
// Schema
const body = z.object({});
const query = z.object({});
const params = z.object({
  key: z.string().nonempty(),
});

// --------------------------------------------------
// Controller
const getSingle: Controller<typeof params, typeof body, typeof query> = async (
  req,
  res,
  next
) => {
  try {
    const brick = await BrickConfig.getSingle(
      req.params.key,
      req.headers["lucid-environment"] as string
    );

    res.status(200).json(
      buildResponse(req, {
        data: brick,
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
  controller: getSingle,
};
