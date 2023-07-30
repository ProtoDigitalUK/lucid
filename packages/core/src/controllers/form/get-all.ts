// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import formsSchema from "@schemas/forms";
// Services
import formsService from "@services/forms";

// --------------------------------------------------
// Controller
const getAllController: Controller<
  typeof formsSchema.getAll.params,
  typeof formsSchema.getAll.body,
  typeof formsSchema.getAll.query
> = async (req, res, next) => {
  try {
    const formsRes = await service(
      formsService.getAll,
      false
    )({
      query: req.query,
    });

    res.status(200).json(
      buildResponse(req, {
        data: formsRes,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: formsSchema.getAll,
  controller: getAllController,
};
