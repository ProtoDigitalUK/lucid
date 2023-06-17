import z from "zod";
// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Environment from "@db/models/Environment";

// --------------------------------------------------
// Schema
const body = z.object({
  assigned_bricks: z.array(z.string()).optional(),
  assigned_collections: z.array(z.string()).optional(),
});
const query = z.object({});
const params = z.object({
  key: z.string(),
});

// --------------------------------------------------
// Controller
const updateSingle: Controller<
  typeof params,
  typeof body,
  typeof query
> = async (req, res, next) => {
  try {
    const environment = await Environment.upsertSingle({
      key: req.params.key,
      ...req.body,
    });

    res.status(200).json(
      buildResponse(req, {
        data: environment,
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
