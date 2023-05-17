import z from "zod";
// Data
import sampleData from "@data/sample.json";

// --------------------------------------------------
// Schema
const body = z.undefined();
const query = z
  .object({
    include: z.string().optional(),
    exclude: z.string().optional(),
    filter: z
      .object({
        id: z.string().optional(),
        active: z.string().optional(),
      })
      .optional(),
    sort: z.string().optional(),
  })
  .optional();
const params = z.object({
  id: z.string(),
});

// --------------------------------------------------
// Controller
const getSingle: Controller<typeof params, typeof body, typeof query> = (
  req,
  res
) => {
  const { id } = req.params;
  const data = sampleData.find((item) => item.id.toString() === id);

  res.status(200).json({
    data: data,
    query: req.query,
  });
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
