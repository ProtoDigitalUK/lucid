import z from "zod";

// --------------------------------------------------
// Schema
export const body = z.object({});
export const query = z.object({});
export const params = z.object({});

// --------------------------------------------------
// Controller
const getHealth: Controller<typeof params, typeof body, typeof query> = async (
  req,
  res,
  next
) => {
  try {
    res.status(200).json({
      health: {
        api: "ok",
        db: "ok",
      },
    });
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
