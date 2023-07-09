// Utils
import buildResponse from "@utils/controllers/build-response";
// Models
import Form from "@db/models/Form";
// Schema
import formsSchema from "@schemas/forms";

// --------------------------------------------------
// Controller
const getAll: Controller<
  typeof formsSchema.getAll.params,
  typeof formsSchema.getAll.body,
  typeof formsSchema.getAll.query
> = async (req, res, next) => {
  try {
    const forms = await Form.getAll(
      req.query,
      req.headers["lucid-environment"] as string
    );

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
  controller: getAll,
};
