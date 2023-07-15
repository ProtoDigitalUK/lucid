// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import rolesSchema from "@schemas/roles";
// Services
import rolesService from "@services/roles";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof rolesSchema.getSingle.params,
  typeof rolesSchema.getSingle.body,
  typeof rolesSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const role = await service(
      rolesService.getSingle,
      false
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
  schema: rolesSchema.getSingle,
  controller: getSingleController,
};
