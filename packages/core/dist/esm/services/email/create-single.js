import { LucidError } from "../../utils/app/error-handler.js";
import Email from "../../db/models/Email.js";
const createSingle = async (client, data) => {
    const email = await Email.createSingle(client, data);
    if (!email) {
        throw new LucidError({
            type: "basic",
            name: "Email",
            message: "Error saving email",
            status: 500,
        });
    }
    return email;
};
export default createSingle;
//# sourceMappingURL=create-single.js.map