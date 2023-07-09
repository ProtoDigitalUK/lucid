// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import environmentSchema from "@schemas/environments";
// Services
import getSingle from "@services/environments/get-single";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof environmentSchema.getSingle.params,
  typeof environmentSchema.getSingle.body,
  typeof environmentSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const environment = await getSingle({
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
