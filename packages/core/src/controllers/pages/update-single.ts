import z from "zod";
// Schema
import { BrickSchema } from "@schemas/bricks";
// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Page from "@db/models/Page";

// --------------------------------------------------
// Schema
const body = z.object({
  bricks: z.array(BrickSchema).optional(),
});
const query = z.object({});
const params = z.object({
  id: z.string(),
});

// --------------------------------------------------
// Controller
const updateSingle: Controller<
  typeof params,
  typeof body,
  typeof query
> = async (req, res, next) => {
  try {
    const page = await Page.update(
      req.params.id,
      {
        bricks: req.body.bricks,
      },
      req
    );

    res.status(200).json(
      buildResponse(req, {
        data: page,
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
  controller: updateSingle,
};
