import { LucidError } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import User from "../../db/models/User.js";
import userServices from "../users/index.js";
import formatUser from "../../utils/format/format-user.js";
const deleteSingle = async (client, data) => {
    await service(userServices.getSingle, false, client)({
        user_id: data.user_id,
    });
    const user = await User.deleteSingle(client, {
        id: data.user_id,
    });
    if (!user) {
        throw new LucidError({
            type: "basic",
            name: "User Not Deleted",
            message: "The user was not deleted",
            status: 500,
        });
    }
    return formatUser(user);
};
export default deleteSingle;
//# sourceMappingURL=delete-single.js.map