import z from "zod";
// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Environment from "@db/models/Environment";

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
    const environments = await Environment.getAll();

    res.status(200).json(
      buildResponse(req, {
        data: environments,
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
