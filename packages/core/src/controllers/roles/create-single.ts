// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import rolesSchema from "@schemas/roles";
// Services
import rolesService from "@services/roles";

// --------------------------------------------------
// Controller
const createSingleController: Controller<
  typeof rolesSchema.createSingle.params,
  typeof rolesSchema.createSingle.body,
  typeof rolesSchema.createSingle.query
> = async (req, res, next) => {
  try {
    const role = await service(
      rolesService.createSingle,
      true
    )({
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
  schema: rolesSchema.createSingle,
  controller: createSingleController,
};
