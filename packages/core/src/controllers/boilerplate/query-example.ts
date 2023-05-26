import z from "zod";
// Services
import buildResponse from "@services/controllers/build-response";

// --------------------------------------------------
// Schema
const body = z.object({});
const query = z.object({
  include: z.array(z.enum(["fields"])),
  exclude: z.undefined(),
  filter: z.object({
    s: z.string(),
  }),
  sort: z.array(
    z.object({
      key: z.enum(["id", "name"]),
      value: z.enum(["asc", "desc"]),
    })
  ),
  page: z.string().optional(),
  per_page: z.string().optional(),
});
const params = z.object({});

// --------------------------------------------------
// Controller
const queryExample: Controller<
  typeof params,
  typeof body,
  typeof query
> = async (req, res, next) => {
  try {
    res.status(200).json(
      buildResponse(req, {
        data: {
          message: "Hello World!",
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
  controller: queryExample,
};
