import userTokensServices from "../user-tokens/index.js";
const verifyResetPassword = async (client, data) => {
    await userTokensServices.getSingle(client, {
        token_type: "password_reset",
        token: data.token,
    });
    return {};
};
export default verifyResetPassword;
//# sourceMappingURL=verify-reset-password.js.map