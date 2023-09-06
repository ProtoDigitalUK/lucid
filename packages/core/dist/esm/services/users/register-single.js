import argon2 from "argon2";
import { LucidError, modelErrors, } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import User from "../../db/models/User.js";
import usersServices from "../users/index.js";
import formatUser from "../../utils/format/format-user.js";
const registerSingle = async (client, data, current_user_id) => {
    let superAdmin = data.super_admin;
    const checkUserProm = Promise.all([
        service(usersServices.getSingleQuery, false, client)({
            email: data.email,
        }),
        service(usersServices.getSingleQuery, false, client)({
            username: data.username,
        }),
    ]);
    const [userByEmail, userByUsername] = await checkUserProm;
    if (userByEmail || userByUsername) {
        const errors = {};
        if (userByEmail) {
            errors.email = {
                code: "email_already_exists",
                message: "A user with that email already exists.",
            };
        }
        if (userByUsername) {
            errors.username = {
                code: "username_already_exists",
                message: "A user with that username already exists.",
            };
        }
        throw new LucidError({
            type: "basic",
            name: "User Already Exists",
            message: "A user with that email or username already exists.",
            status: 400,
            errors: modelErrors(errors),
        });
    }
    await service(usersServices.checkIfUserExists, false, client)({
        email: data.email,
        username: data.username,
    });
    if (current_user_id !== undefined && data.super_admin === true) {
        const currentUser = await service(usersServices.getSingle, false, client)({
            user_id: current_user_id,
        });
        if (!currentUser.super_admin) {
            superAdmin = false;
        }
    }
    const hashedPassword = await argon2.hash(data.password);
    const user = await User.createSingle(client, {
        email: data.email,
        username: data.username,
        password: hashedPassword,
        super_admin: superAdmin,
        first_name: data.first_name,
        last_name: data.last_name,
    });
    if (!user) {
        throw new LucidError({
            type: "basic",
            name: "User Not Created",
            message: "There was an error creating the user.",
            status: 500,
        });
    }
    if (data.role_ids && data.role_ids.length > 0) {
        await service(usersServices.updateRoles, false, client)({
            user_id: user.id,
            role_ids: data.role_ids,
        });
    }
    const userPermissions = await service(usersServices.getPermissions, false, client)({
        user_id: user.id,
    });
    return formatUser(user, userPermissions);
};
export default registerSingle;
//# sourceMappingURL=register-single.js.map