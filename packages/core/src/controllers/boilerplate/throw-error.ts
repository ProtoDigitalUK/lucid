import z from "zod";
// Utils
import { LucidError } from "@utils/error-handler";

// --------------------------------------------------
// Schema
const body = z.object({});
const query = z.object({
  include: z.string().optional(),
  exclude: z.string().optional(),
  filter: z.object({}).optional(),
  sort: z.string().optional(),
});
const params = z.object({});

// --------------------------------------------------
// Controller
const throwError: Controller<typeof params, typeof body, typeof query> = async (
  req,
  res,
  next
) => {
  try {
    throw new LucidError({
      type: "basic",
      name: "Test Error",
      message: "This is a test error",
      status: 500,
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
  controller: throwError,
};
