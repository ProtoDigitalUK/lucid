// Services
import buildResponse from "@services/controllers/build-response";
// Models
import Form from "@db/models/Form";
// Schema
import formsSchema from "@schemas/forms";

// --------------------------------------------------
// Controller
const getSingle: Controller<
  typeof formsSchema.getSingle.params,
  typeof formsSchema.getSingle.body,
  typeof formsSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const form = await Form.getSingle({
      key: req.params.form_key,
      environment_key: req.headers["lucid-environment"] as string,
    });

    res.status(200).json(
      buildResponse(req, {
        data: form,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: formsSchema.getSingle,
  controller: getSingle,
};
