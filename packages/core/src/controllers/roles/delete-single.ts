// Utils
import buildResponse from "@utils/app/build-response";
// Schema
import rolesSchema from "@schemas/roles";
// Services
import roles from "@services/roles";

// --------------------------------------------------
// Controller
const deleteSingleController: Controller<
  typeof rolesSchema.deleteSingle.params,
  typeof rolesSchema.deleteSingle.body,
  typeof rolesSchema.deleteSingle.query
> = async (req, res, next) => {
  try {
    const role = await roles.deleteSingle({
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
