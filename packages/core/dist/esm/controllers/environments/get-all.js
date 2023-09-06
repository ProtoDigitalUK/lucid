import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import environmentSchema from "../../schemas/environments.js";
import environmentsService from "../../services/environments/index.js";
const getAllController = async (req, res, next) => {
    try {
        const environmentsRes = await service(environmentsService.getAll, false)();
        res.status(200).json(buildResponse(req, {
            data: environmentsRes,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: environmentSchema.getAll,
    controller: getAllController,
};
//# sourceMappingURL=get-all.js.map