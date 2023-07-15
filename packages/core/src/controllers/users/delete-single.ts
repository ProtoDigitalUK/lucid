// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import usersSchema from "@schemas/users";
// Services
import usersService from "@services/users";

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
      true
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
