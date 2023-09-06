// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import formSubmissionsSchema from "@schemas/form-submissions.js";
// Services
import formSubService from "@services/form-submissions/index.js";

// --------------------------------------------------
// Controller
const getMultipleController: Controller<
  typeof formSubmissionsSchema.getMultiple.params,
  typeof formSubmissionsSchema.getMultiple.body,
  typeof formSubmissionsSchema.getMultiple.query
> = async (req, res, next) => {
  try {
    const submissions = await service(
      formSubService.getMultiple,
      false
    )({
      query: req.query,
      form_key: req.params.form_key,
      environment_key: req.headers["lucid-environment"] as string,
    });

    res.status(200).json(
      buildResponse(req, {
        data: submissions.data,
        pagination: {
          count: submissions.count,
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
  schema: formSubmissionsSchema.getMultiple,
  controller: getMultipleController,
};
