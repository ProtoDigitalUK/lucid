// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import environmentSchema from "@schemas/environments";
// Services
import environmentsService from "@services/environments";

// --------------------------------------------------
// Controller
const getAllController: Controller<
  typeof environmentSchema.getAll.params,
  typeof environmentSchema.getAll.body,
  typeof environmentSchema.getAll.query
> = async (req, res, next) => {
  try {
    const environmentsRes = await service(environmentsService.getAll, false)();

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
