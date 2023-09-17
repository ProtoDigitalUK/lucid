// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import usersSchema from "@schemas/users.js";
// Services
import usersService from "@services/users/index.js";

// --------------------------------------------------
// Controller
const deleteSingleController: Controller<
  typeof usersSchema.deleteSingle.params,
  typeof usersSchema.deleteSingle.body,
  typeof usersSchema.deleteSingle.query
> = async (req, res, next) => {
  try {
    const user = await service(
      usersService.deleteSingle,
      false
    )({
      user_id: parseInt(req.params.id),
    });

    res.status(200).json(
      buildResponse(req, {
        data: user,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: usersSchema.deleteSingle,
  controller: deleteSingleController,
};
