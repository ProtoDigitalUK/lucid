// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import environmentSchema from "@schemas/environments.js";
// Services
import environmentsService from "@services/environments/index.js";

// --------------------------------------------------
// Controller
const deleteSingleController: Controller<
  typeof environmentSchema.deleteSingle.params,
  typeof environmentSchema.deleteSingle.body,
  typeof environmentSchema.deleteSingle.query
> = async (req, res, next) => {
  try {
    const environment = await service(
      environmentsService.deleteSingle,
      false
    )({
      key: req.params.key,
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
  schema: environmentSchema.deleteSingle,
  controller: deleteSingleController,
};
