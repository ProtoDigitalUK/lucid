// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import environmentSchema from "@schemas/environments";
// Services
import upsertSingle from "@services/environments/upsert-single";

// --------------------------------------------------
// Controller
const createSingleController: Controller<
  typeof environmentSchema.createSingle.params,
  typeof environmentSchema.createSingle.body,
  typeof environmentSchema.createSingle.query
> = async (req, res, next) => {
  try {
    const environment = await upsertSingle({
      data: {
        key: req.body.key,
        title: req.body.title,
        assigned_bricks: req.body.assigned_bricks,
        assigned_collections: req.body.assigned_collections,
        assigned_forms: req.body.assigned_forms,
      },
      create: true,
    });

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
  controller: createSingleController,
};
