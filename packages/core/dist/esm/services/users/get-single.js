import { LucidError } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import usersServices from "../users/index.js";
import formatUser from "../../utils/format/format-user.js";
const getSingle = async (client, data) => {
    const user = await service(usersServices.getSingleQuery, false, client)({
        user_id: data.user_id,
        email: data.email,
        username: data.username,
    });
    if (!user) {
        throw new LucidError({
            type: "basic",
            name: "User Not Found",
            message: "There was an error finding the user.",
            status: 500,
        });
    }
    const userPermissions = await service(usersServices.getPermissions, false, client)({
        user_id: user.id,
    });
    return formatUser(user, userPermissions);
};
export default getSingle;
//# sourceMappingURL=get-single.js.map