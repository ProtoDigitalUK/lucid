import { add } from "date-fns";
import C from "../../constants.js";
import service from "../../utils/app/service.js";
import userTokensServices from "../user-tokens/index.js";
import emailServices from "../email/index.js";
import usersServices from "../users/index.js";
import Config from "../Config.js";
const sendResetPassword = async (client, data) => {
    const successMessage = `If an account with that email exists, we've sent you an email with instructions to reset your password.`;
    const user = await service(usersServices.getSingleQuery, false, client)({
        email: data.email,
    });
    if (!user) {
        return {
            message: successMessage,
        };
    }
    const expiryDate = add(new Date(), { hours: 1 }).toISOString();
    const userToken = await service(userTokensServices.createSingle, false, client)({
        user_id: user.id,
        token_type: "password_reset",
        expiry_date: expiryDate,
    });
    await service(emailServices.sendEmailInternal, false, client)({
        template: "reset-password",
        params: {
            data: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                url: `${Config.host}${C.locations.resetPassword}?token=${userToken.token}`,
            },
            options: {
                to: user.email,
                subject: "Reset your password",
            },
        },
    });
    return {
        message: successMessage,
    };
};
export default sendResetPassword;
//# sourceMappingURL=send-reset-password.js.map