// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import usersSchema from "@schemas/users";
// Services
import usersService from "@services/users";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof usersSchema.getSingle.params,
  typeof usersSchema.getSingle.body,
  typeof usersSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const user = await service(
      usersService.getSingle,
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
  schema: usersSchema.getSingle,
  controller: getSingleController,
};
