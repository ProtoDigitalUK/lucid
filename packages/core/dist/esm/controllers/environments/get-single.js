import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import environmentSchema from "../../schemas/environments.js";
import environmentsService from "../../services/environments/index.js";
const getSingleController = async (req, res, next) => {
    try {
        const environment = await service(environmentsService.getSingle, false)({
            key: req.params.key,
        });
        res.status(200).json(buildResponse(req, {
            data: environment,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: environmentSchema.getSingle,
    controller: getSingleController,
};
//# sourceMappingURL=get-single.js.map