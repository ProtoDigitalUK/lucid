// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import environmentSchema from "@schemas/environments";
// Services
import environmentsService from "@services/environments";

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
      true
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
