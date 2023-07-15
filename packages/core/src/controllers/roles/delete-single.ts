// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import rolesSchema from "@schemas/roles";
// Services
import rolesService from "@services/roles";

// --------------------------------------------------
// Controller
const deleteSingleController: Controller<
  typeof rolesSchema.deleteSingle.params,
  typeof rolesSchema.deleteSingle.body,
  typeof rolesSchema.deleteSingle.query
> = async (req, res, next) => {
  try {
    const role = await service(
      rolesService.deleteSingle,
      true
    )({
      id: parseInt(req.params.id),
    });

    res.status(200).json(
      buildResponse(req, {
        data: role,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: rolesSchema.deleteSingle,
  controller: deleteSingleController,
};
