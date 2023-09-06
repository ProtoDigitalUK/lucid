// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import usersSchema from "@schemas/users.js";
// Services
import usersService from "@services/users/index.js";

// --------------------------------------------------
// Controller
const getMultipleController: Controller<
  typeof usersSchema.getMultiple.params,
  typeof usersSchema.getMultiple.body,
  typeof usersSchema.getMultiple.query
> = async (req, res, next) => {
  try {
    const user = await service(
      usersService.getMultiple,
      false
    )({
      query: req.query,
    });

    res.status(200).json(
      buildResponse(req, {
        data: user.data,
        pagination: {
          count: user.count,
          page: req.query.page as string,
          per_page: req.query.per_page as string,
        },
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: usersSchema.getMultiple,
  controller: getMultipleController,
};
