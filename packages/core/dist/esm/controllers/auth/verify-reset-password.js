import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import authSchema from "../../schemas/auth.js";
import authService from "../../services/auth/index.js";
const verifyResetPasswordController = async (req, res, next) => {
    try {
        const verifyResetPassword = await service(authService.verifyResetPassword, false)({
            token: req.params.token,
        });
        res.status(200).json(buildResponse(req, {
            data: verifyResetPassword,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: authSchema.verifyResetPassword,
    controller: verifyResetPasswordController,
};
//# sourceMappingURL=verify-reset-password.js.map