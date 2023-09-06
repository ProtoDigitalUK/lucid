import { LucidError } from "../../utils/app/error-handler.js";
import Email from "../../db/models/Email.js";
const deleteSingle = async (client, data) => {
    const email = await Email.deleteSingle(client, {
        id: data.id,
    });
    if (email) {
        throw new LucidError({
            type: "basic",
            name: "Email",
            message: "Email not found",
            status: 404,
        });
    }
    return email;
};
export default deleteSingle;
//# sourceMappingURL=delete-single.js.map