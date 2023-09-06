import argon2 from "argon2";
const validatePassword = async (data) => {
    return await argon2.verify(data.hashedPassword, data.password);
};
export default validatePassword;
//# sourceMappingURL=validate-password.js.map