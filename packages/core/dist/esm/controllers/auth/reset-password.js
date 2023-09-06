import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import authSchema from "../../schemas/auth.js";
import authService from "../../services/auth/index.js";
const resetPasswordController = async (req, res, next) => {
    try {
        const resetPassword = await service(authService.resetPassword, true)({
            token: req.params.token,
            password: req.body.password,
        });
        res.status(200).json(buildResponse(req, {
            data: resetPassword,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: authSchema.resetPassword,
    controller: resetPasswordController,
};
//# sourceMappingURL=reset-password.js.map