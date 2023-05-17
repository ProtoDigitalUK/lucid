import z from "zod";
// Data
import sampleData from "@data/sample.json";

export const body = z.undefined();
export const query = z
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
export const params = z.object({
  id: z.string(),
});

const getSingle: Controller<typeof params, typeof body, typeof query> = (
  req,
  res
) => {
  const { id } = req.params;
  const data = sampleData.find((item) => item.id.toString() === id);

  const validate = query.parse(req.query);

  res.status(200).json({
    data: data,
    validate,
    query: req.query,
  });
};

export default getSingle;
