// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import environmentSchema from "@schemas/environments";
// Services
import environmentsService from "@services/environments";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof environmentSchema.getSingle.params,
  typeof environmentSchema.getSingle.body,
  typeof environmentSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const environment = await service(
      environmentsService.getSingle,
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
  schema: environmentSchema.getSingle,
  controller: getSingleController,
};
