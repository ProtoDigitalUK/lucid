import buildResponse from "../../utils/app/build-response.js";
import environmentSchema from "../../schemas/environments.js";
import environmentsService from "../../services/environments/index.js";
const migrateEnvironmentController = async (req, res, next) => {
    try {
        await environmentsService.migrateEnvironment({});
        res.status(200).json(buildResponse(req, {
            data: {
                message: "Environment migrated successfully",
            },
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: environmentSchema.migrateEnvironment,
    controller: migrateEnvironmentController,
};
//# sourceMappingURL=migrate-envrionment.js.map