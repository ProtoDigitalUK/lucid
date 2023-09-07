// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import rolesSchema from "@schemas/roles.js";
// Services
import rolesService from "@services/roles/index.js";

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
