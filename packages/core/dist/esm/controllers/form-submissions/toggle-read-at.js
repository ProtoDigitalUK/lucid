import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import formSubmissionsSchema from "../../schemas/form-submissions.js";
import formSubService from "../../services/form-submissions/index.js";
const toggleReadAtController = async (req, res, next) => {
    try {
        const formSubmission = await service(formSubService.toggleReadAt, true)({
            id: parseInt(req.params.id),
            form_key: req.params.form_key,
            environment_key: req.headers["lucid-environment"],
        });
        res.status(200).json(buildResponse(req, {
            data: formSubmission,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: formSubmissionsSchema.toggleReadAt,
    controller: toggleReadAtController,
};
//# sourceMappingURL=toggle-read-at.js.map