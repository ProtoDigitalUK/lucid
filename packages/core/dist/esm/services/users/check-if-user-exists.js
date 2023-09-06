import { LucidError, modelErrors } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import usersServices from "../users/index.js";
const checkIfUserExists = async (client, data) => {
    const user = await service(usersServices.getSingleQuery, false, client)({
        email: data.email,
        username: data.username,
    });
    if (user) {
        throw new LucidError({
            type: "basic",
            name: "User Already Exists",
            message: "A user with that email or username already exists.",
            status: 400,
            errors: modelErrors({
                email: {
                    code: "email_already_exists",
                    message: "A user with that email already exists.",
                },
                username: {
                    code: "username_already_exists",
                    message: "A user with that username already exists.",
                },
            }),
        });
    }
    return user;
};
export default checkIfUserExists;
//# sourceMappingURL=check-if-user-exists.js.map