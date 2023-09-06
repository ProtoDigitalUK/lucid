import service from "../../utils/app/service.js";
import userTokensServices from "../user-tokens/index.js";
import emailServices from "../email/index.js";
import userServices from "../users/index.js";
const resetPassword = async (client, data) => {
    const successMessage = `You have successfully reset your password. Please login with your new password.`;
    const userToken = await service(userTokensServices.getSingle, false, client)({
        token_type: "password_reset",
        token: data.token,
    });
    const user = await service(userServices.updateSingle, false, client)({
        user_id: userToken.user_id,
        password: data.password,
    });
    await service(userTokensServices.deleteSingle, false, client)({
        id: userToken.id,
    });
    await service(emailServices.sendEmailInternal, false, client)({
        template: "password-reset",
        params: {
            data: {
                first_name: user.first_name,
                last_name: user.last_name,
            },
            options: {
                to: user.email,
                subject: "Your password has been reset",
            },
        },
    });
    return {
        message: successMessage,
    };
};
export default resetPassword;
//# sourceMappingURL=reset-password.js.map