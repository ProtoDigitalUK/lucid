// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Environment from "@db/models/Environment";
// Schema
import environmentSchema from "@schemas/environments";

// --------------------------------------------------
// Controller
const getSingle: Controller<
  typeof environmentSchema.getSingle.params,
  typeof environmentSchema.getSingle.body,
  typeof environmentSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const environment = await Environment.getSingle(req.params.key);

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
  schema: environmentSchema.getSingle,
  controller: getSingle,
};
