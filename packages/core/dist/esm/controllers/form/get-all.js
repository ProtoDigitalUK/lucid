import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import formsSchema from "../../schemas/forms.js";
import formsService from "../../services/forms/index.js";
const getAllController = async (req, res, next) => {
    try {
        const formsRes = await service(formsService.getAll, false)({
            query: req.query,
        });
        res.status(200).json(buildResponse(req, {
            data: formsRes,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: formsSchema.getAll,
    controller: getAllController,
};
//# sourceMappingURL=get-all.js.map