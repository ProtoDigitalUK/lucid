import buildResponse from "../../utils/app/build-response.js";
import authSchema from "../../schemas/auth.js";
import authService from "../../services/auth/index.js";
const getCSRFController = async (req, res, next) => {
    try {
        const token = authService.csrf.generateCSRFToken(res);
        res.status(200).json(buildResponse(req, {
            data: {
                _csrf: token,
            },
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: authSchema.getCSRF,
    controller: getCSRFController,
};
//# sourceMappingURL=get-csrf.js.map