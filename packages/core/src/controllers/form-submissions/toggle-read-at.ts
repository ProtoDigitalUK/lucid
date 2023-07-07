// Services
import buildResponse from "@services/controllers/build-response";
// Models
import FormSubmission from "@db/models/FormSubmission";
// Schema
import formSubmissionsSchema from "@schemas/form-submissions";

// --------------------------------------------------
// Controller
const toggleReadAt: Controller<
  typeof formSubmissionsSchema.toggleReadAt.params,
  typeof formSubmissionsSchema.toggleReadAt.body,
  typeof formSubmissionsSchema.toggleReadAt.query
> = async (req, res, next) => {
  try {
    const formSubmission = await FormSubmission.toggleReadAt({
      id: parseInt(req.params.id),
      form_key: req.params.form_key,
      environment_key: req.headers["lucid-environment"] as string,
    });

    res.status(200).json(
      buildResponse(req, {
        data: formSubmission,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: formSubmissionsSchema.toggleReadAt,
  controller: toggleReadAt,
};
