import { LucidError } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import authServices from "../auth/index.js";
import usersServices from "../users/index.js";
const login = async (client, data) => {
    const user = await service(usersServices.getSingleQuery, false, client)({
        username: data.username,
    });
    if (!user || !user.password) {
        throw new LucidError({
            type: "basic",
            name: "User Not Found",
            message: "The username or password you entered is incorrect.",
            status: 500,
        });
    }
    const passwordValid = await authServices.validatePassword({
        hashedPassword: user.password,
        password: data.password,
    });
    if (!passwordValid) {
        throw new LucidError({
            type: "basic",
            name: "User Not Found",
            message: "The username or password you entered is incorrect.",
            status: 500,
        });
    }
    return await service(usersServices.getSingle, false, client)({
        user_id: user.id,
    });
};
export default login;
//# sourceMappingURL=login.js.map