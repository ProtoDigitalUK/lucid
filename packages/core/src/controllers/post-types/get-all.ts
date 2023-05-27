import z from "zod";
// Services
import buildResponse from "@services/controllers/build-response";
// Models
import PostType from "@db/models/PostType";

// --------------------------------------------------
// Schema
const body = z.object({});
const query = z.object({});
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
    const postTypes = await PostType.getAll();

    res.status(200).json(
      buildResponse(req, {
        data: postTypes,
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
