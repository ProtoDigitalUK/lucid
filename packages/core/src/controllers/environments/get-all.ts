// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import environmentSchema from "@schemas/environments";
// Services
import environments from "@services/environments";

// --------------------------------------------------
// Controller
const getAllController: Controller<
  typeof environmentSchema.getAll.params,
  typeof environmentSchema.getAll.body,
  typeof environmentSchema.getAll.query
> = async (req, res, next) => {
  try {
    const environmentsRes = await environments.getAll({});

    res.status(200).json(
      buildResponse(req, {
        data: environmentsRes,
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
  controller: getAllController,
};
