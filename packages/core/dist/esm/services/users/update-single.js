import argon2 from "argon2";
import { LucidError, modelErrors, } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import User from "../../db/models/User.js";
import usersServices from "../users/index.js";
const updateSingle = async (client, data, current_user_id) => {
    const user = await service(usersServices.getSingle, false, client)({
        user_id: data.user_id,
    });
    if (data.first_name !== undefined && data.first_name === user.first_name)
        delete data.first_name;
    if (data.last_name !== undefined && data.last_name === user.last_name)
        delete data.last_name;
    if (data.username !== undefined && data.username === user.username)
        delete data.username;
    if (data.email !== undefined && data.email === user.email)
        delete data.email;
    const [usernameCheck, emailCheck] = await Promise.all([
        data.username !== undefined
            ? service(usersServices.getSingleQuery, false, client)({
                username: data.username,
            })
            : Promise.resolve(undefined),
        data.email !== undefined
            ? service(usersServices.getSingleQuery, false, client)({
                email: data.email,
            })
            : Promise.resolve(undefined),
    ]);
    if (usernameCheck !== undefined || emailCheck !== undefined) {
        const errors = {};
        if (emailCheck) {
            errors.email = {
                code: "email_already_exists",
                message: "A user with that email already exists.",
            };
        }
        if (usernameCheck) {
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
    let hashedPassword = undefined;
    if (data.password) {
        hashedPassword = await argon2.hash(data.password);
    }
    let superAdmin = data.super_admin;
    if (current_user_id !== undefined && superAdmin !== undefined) {
        const currentUser = await service(usersServices.getSingle, false, client)({
            user_id: current_user_id,
        });
        if (!currentUser.super_admin) {
            superAdmin = undefined;
        }
    }
    const userUpdate = await User.updateSingle(client, {
        user_id: data.user_id,
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        email: data.email,
        password: hashedPassword,
        super_admin: superAdmin,
    });
    if (!userUpdate) {
        throw new LucidError({
            type: "basic",
            name: "User Not Updated",
            message: "The user was not updated.",
            status: 500,
        });
    }
    if (data.role_ids) {
        await service(usersServices.updateRoles, false, client)({
            user_id: data.user_id,
            role_ids: data.role_ids,
        });
    }
    return await service(usersServices.getSingle, false, client)({
        user_id: data.user_id,
    });
};
export default updateSingle;
//# sourceMappingURL=update-single.js.map