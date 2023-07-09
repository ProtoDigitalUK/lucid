// Utils
import buildResponse from "@utils/controllers/build-response";
// Models
import Environment from "@db/models/Environment";
// Schema
import environmentSchema from "@schemas/environments";

// --------------------------------------------------
// Controller
const deleteSingle: Controller<
  typeof environmentSchema.deleteSingle.params,
  typeof environmentSchema.deleteSingle.body,
  typeof environmentSchema.deleteSingle.query
> = async (req, res, next) => {
  try {
    const environment = await Environment.deleteSingle(req.params.key);

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
  schema: environmentSchema.deleteSingle,
  controller: deleteSingle,
};
