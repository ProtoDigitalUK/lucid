// Utils
import buildResponse from "@utils/controllers/build-response";
// Models
import Environment from "@db/models/Environment";
// Schema
import environmentSchema from "@schemas/environments";

// --------------------------------------------------
// Controller
const getAll: Controller<
  typeof environmentSchema.getAll.params,
  typeof environmentSchema.getAll.body,
  typeof environmentSchema.getAll.query
> = async (req, res, next) => {
  try {
    const environments = await Environment.getAll();

    res.status(200).json(
      buildResponse(req, {
        data: environments,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: environmentSchema.getAll,
  controller: getAll,
};
