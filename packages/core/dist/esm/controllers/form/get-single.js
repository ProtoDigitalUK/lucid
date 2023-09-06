import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import formsSchema from "../../schemas/forms.js";
import formsService from "../../services/forms/index.js";
const getSingleController = async (req, res, next) => {
    try {
        const form = await service(formsService.getSingle, false)({
            key: req.params.form_key,
            environment_key: req.headers["lucid-environment"],
        });
        res.status(200).json(buildResponse(req, {
            data: form,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: formsSchema.getSingle,
    controller: getSingleController,
};
//# sourceMappingURL=get-single.js.map