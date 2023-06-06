import z from "zod";
// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Page from "@db/models/Page";

// --------------------------------------------------
// Schema
const body = z.object({});
const query = z.object({});
const params = z.object({
  id: z.string(),
});

// --------------------------------------------------
// Controller
const getSingle: Controller<typeof params, typeof body, typeof query> = async (
  req,
  res,
  next
) => {
  try {
    const page = await Page.getSingle(req.params.id, req);

    res.status(200).json(
      buildResponse(req, {
        data: page,
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
