// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import formsSchema from "@schemas/forms";
// Services
import getAll from "@services/form/get-all";

// --------------------------------------------------
// Controller
const getAllController: Controller<
  typeof formsSchema.getAll.params,
  typeof formsSchema.getAll.body,
  typeof formsSchema.getAll.query
> = async (req, res, next) => {
  try {
    const forms = await getAll({
      query: req.query,
      environment_key: req.headers["lucid-environment"] as string,
    });

    res.status(200).json(
      buildResponse(req, {
        data: forms,
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
