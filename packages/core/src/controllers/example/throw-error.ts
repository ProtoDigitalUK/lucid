import z from "zod";
// Utils
import { LucidError } from "@utils/error-handler";
// Data
import sampleData from "@data/sample.json";

// --------------------------------------------------
// Schema
const body = z.object({
  name: z.string().min(2),
  active: z.boolean(),
  items: z.array(z.object({ id: z.string(), name: z.string() })).length(3),
  person: z.object({
    name: z.string().min(2),
    age: z.number().min(18),
  }),
});
const query = z.object({
  include: z.string().optional(),
  exclude: z.string().optional(),
  filter: z
    .object({
      id: z.string().optional(),
      active: z.enum(["1", "-1"]).optional(),
    })
    .optional(),
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
    const data = sampleData.find((item) => item.id.toString() === "1");
    throw new LucidError({
      type: "basic",
      name: "Test Error",
      message: "This is a test error",
      status: 500,
    });

    res.status(200).json({
      data: data,
      query: req.query,
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
