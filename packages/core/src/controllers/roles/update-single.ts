// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import rolesSchema from "@schemas/roles.js";
// Services
import rolesService from "@services/roles/index.js";

// --------------------------------------------------
// Controller
const updateSingleController: Controller<
  typeof rolesSchema.updateSingle.params,
  typeof rolesSchema.updateSingle.body,
  typeof rolesSchema.updateSingle.query
> = async (req, res, next) => {
  try {
    const role = await service(
      rolesService.updateSingle,
      true
    )({
      id: parseInt(req.params.id),
      name: req.body.name,
      permission_groups: req.body.permission_groups,
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
  schema: rolesSchema.updateSingle,
  controller: updateSingleController,
};
