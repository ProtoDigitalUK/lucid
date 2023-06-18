// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Environment from "@db/models/Environment";
// Schema
import environmentSchema from "@schemas/environments";

// --------------------------------------------------
// Controller
const updateSingle: Controller<
  typeof environmentSchema.updateSingle.params,
  typeof environmentSchema.updateSingle.body,
  typeof environmentSchema.updateSingle.query
> = async (req, res, next) => {
  try {
    const environment = await Environment.upsertSingle({
      key: req.params.key,
      ...req.body,
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
  schema: environmentSchema.updateSingle,
  controller: updateSingle,
};
