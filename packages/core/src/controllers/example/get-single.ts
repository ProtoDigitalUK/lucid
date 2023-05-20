import z from "zod";
import sql from "@db/db";
import buildSchema from "@utils/build-schema";
// Data
import sampleData from "@data/sample.json";

// --------------------------------------------------
// Schema
const body = z.object({});
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
    const { id } = req.params;
    const data = sampleData.find((item) => item.id.toString() === id);

    let userId = `22f0c1b3-6ded-46d2-8ce4-61e23fd14f8a`;
    const results = await sql`SELECT * FROM users WHERE id = ${userId}`;

    res.status(200).json({
      queryResults: results,
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
  controller: getSingle,
};
