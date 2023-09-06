import { LucidError } from "../../utils/app/error-handler.js";
import Role from "../../db/models/Role.js";
import formatRole from "../../utils/format/format-roles.js";
const getSingle = async (client, data) => {
    const role = await Role.getSingle(client, {
        id: data.id,
    });
    if (!role) {
        throw new LucidError({
            type: "basic",
            name: "Role Error",
            message: "There was an error getting the role.",
            status: 500,
        });
    }
    return formatRole(role);
};
export default getSingle;
//# sourceMappingURL=get-single.js.map