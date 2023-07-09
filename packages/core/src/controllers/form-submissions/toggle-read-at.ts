// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import formSubmissionsSchema from "@schemas/form-submissions";
// Services
import formSubmissions from "@services/form-submissions";

// --------------------------------------------------
// Controller
const toggleReadAtController: Controller<
  typeof formSubmissionsSchema.toggleReadAt.params,
  typeof formSubmissionsSchema.toggleReadAt.body,
  typeof formSubmissionsSchema.toggleReadAt.query
> = async (req, res, next) => {
  try {
    const formSubmission = await formSubmissions.toggleReadAt({
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
  controller: toggleReadAtController,
};
