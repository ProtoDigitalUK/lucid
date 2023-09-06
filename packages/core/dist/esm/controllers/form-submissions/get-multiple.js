import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import formSubmissionsSchema from "../../schemas/form-submissions.js";
import formSubService from "../../services/form-submissions/index.js";
const getMultipleController = async (req, res, next) => {
    try {
        const submissions = await service(formSubService.getMultiple, false)({
            query: req.query,
            form_key: req.params.form_key,
            environment_key: req.headers["lucid-environment"],
        });
        res.status(200).json(buildResponse(req, {
            data: submissions.data,
            pagination: {
                count: submissions.count,
                page: req.query.page,
                per_page: req.query.per_page,
            },
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: formSubmissionsSchema.getMultiple,
    controller: getMultipleController,
};
//# sourceMappingURL=get-multiple.js.map