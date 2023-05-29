import z from "zod";
// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Page from "@db/models/Page";

// --------------------------------------------------
// Schema
const body = z.object({});
const query = z.object({
  filter: z.object({}).optional(),
  sort: z
    .array(
      z.object({
        key: z.enum(["created_at"]),
        value: z.enum(["asc", "desc"]),
      })
    )
    .optional(),
  page: z.string().optional(),
  per_page: z.string().optional(),
});
const params = z.object({});
// query

// --------------------------------------------------
// Controller
const getMultiple: Controller<
  typeof params,
  typeof body,
  typeof query
> = async (req, res, next) => {
  try {
    const pages = await Page.getMultiple(req);

    res.status(200).json(
      buildResponse(req, {
        data: pages.data,
        pagination: {
          count: pages.count,
          page: req.query.page as string,
          per_page: req.query.per_page as string,
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
  controller: getMultiple,
};
