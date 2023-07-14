// Utils
import buildResponse from "@utils/app/build-response";
// Models
import { OptionT } from "@db/models/Option";
// Schema
import optionsSchema from "@schemas/options";
// Services
import optionsService from "@services/options";

// --------------------------------------------------
// Controller
const getSinglePublicController: Controller<
  typeof optionsSchema.getSinglePublic.params,
  typeof optionsSchema.getSinglePublic.body,
  typeof optionsSchema.getSinglePublic.query
> = async (req, res, next) => {
  try {
    const option = await optionsService.getByName({
      name: req.params.name as OptionT["option_name"],
    });

    res.status(200).json(
      buildResponse(req, {
        data: option,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: optionsSchema.getSinglePublic,
  controller: getSinglePublicController,
};
