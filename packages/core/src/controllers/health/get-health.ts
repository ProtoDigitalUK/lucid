import z from "zod";
// Services
import buildResponse from "@services/controllers/build-response";

// --------------------------------------------------
// Schema
const body = z.object({});
const query = z.object({});
const params = z.object({});

// --------------------------------------------------
// Controller
const getHealth: Controller<typeof params, typeof body, typeof query> = async (
  req,
  res,
  next
) => {
  try {
    res.status(200).json(
      buildResponse(req, {
        data: {
          api: "ok",
          db: "ok",
        },
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
  controller: getHealth,
};
