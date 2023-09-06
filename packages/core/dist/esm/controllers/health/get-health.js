import buildResponse from "../../utils/app/build-response.js";
import healthSchema from "../../schemas/health.js";
import healthService from "../../services/health/index.js";
const getHealthController = async (req, res, next) => {
    try {
        const healthRes = await healthService.getHealth({});
        res.status(200).json(buildResponse(req, {
            data: healthRes,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: healthSchema.getHealth,
    controller: getHealthController,
};
//# sourceMappingURL=get-health.js.map