// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import environmentSchema from "@schemas/environments.js";
// Services
import environmentsService from "@services/environments/index.js";

// --------------------------------------------------
// Controller
const createSingleController: Controller<
  typeof environmentSchema.createSingle.params,
  typeof environmentSchema.createSingle.body,
  typeof environmentSchema.createSingle.query
> = async (req, res, next) => {
  try {
    const environment = await service(
      environmentsService.upsertSingle,
      true
    )({
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
