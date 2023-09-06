import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import authSchema from "../../schemas/auth.js";
import authService from "../../services/auth/index.js";
const sendResetPasswordController = async (req, res, next) => {
    try {
        const resetPassword = await service(authService.sendResetPassword, false)({
            email: req.body.email,
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
    schema: authSchema.sendResetPassword,
    controller: sendResetPasswordController,
};
//# sourceMappingURL=send-reset-password.js.map