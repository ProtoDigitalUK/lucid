import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import bricksSchema from "../../schemas/bricks.js";
import brickConfigService from "../../services/brick-config/index.js";
const getSingleController = async (req, res, next) => {
    try {
        const brick = await service(brickConfigService.getSingle, false)({
            brick_key: req.params.brick_key,
        });
        res.status(200).json(buildResponse(req, {
            data: brick,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: bricksSchema.config.getSingle,
    controller: getSingleController,
};
//# sourceMappingURL=get-single.js.map