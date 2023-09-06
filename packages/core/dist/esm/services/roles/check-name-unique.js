import { LucidError, modelErrors } from "../../utils/app/error-handler.js";
import Role from "../../db/models/Role.js";
const checkNameIsUnique = async (client, data) => {
    const role = await Role.getSingleByName(client, {
        name: data.name,
    });
    if (role) {
        throw new LucidError({
            type: "basic",
            name: "Role Error",
            message: "The role name must be unique.",
            status: 500,
            errors: modelErrors({
                name: {
                    code: "Not unique",
                    message: "The role name must be unique.",
                },
            }),
        });
    }
    return role;
};
export default checkNameIsUnique;
//# sourceMappingURL=check-name-unique.js.map