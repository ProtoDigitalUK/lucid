import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import bricksSchema from "../../schemas/bricks.js";
import brickConfigService from "../../services/brick-config/index.js";
const getAllController = async (req, res, next) => {
    try {
        const bricks = await service(brickConfigService.getAll, false)({
            query: req.query,
        });
        res.status(200).json(buildResponse(req, {
            data: bricks,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: bricksSchema.config.getAll,
    controller: getAllController,
};
//# sourceMappingURL=get-all.js.map