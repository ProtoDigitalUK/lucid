// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Environment from "@db/models/Environment";
// Schema
import environmentSchema from "@schemas/environments";

// --------------------------------------------------
// Controller
const createSingle: Controller<
  typeof environmentSchema.createSingle.params,
  typeof environmentSchema.createSingle.body,
  typeof environmentSchema.createSingle.query
> = async (req, res, next) => {
  try {
    const environment = await Environment.upsertSingle(
      {
        key: req.body.key,
        title: req.body.title,
        assigned_bricks: req.body.assigned_bricks,
        assigned_collections: req.body.assigned_collections,
        assigned_forms: req.body.assigned_forms,
      },
      true
    );

    res.status(200).json(
      buildResponse(req, {
        data: environment,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: environmentSchema.createSingle,
  controller: createSingle,
};
