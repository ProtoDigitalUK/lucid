import { LucidError } from "../../utils/app/error-handler.js";
import Email from "../../db/models/Email.js";
const updatteSingle = async (client, data) => {
    const email = await Email.updateSingle(client, {
        id: data.id,
        from_address: data.data.from_address,
        from_name: data.data.from_name,
        delivery_status: data.data.delivery_status,
    });
    if (!email) {
        throw new LucidError({
            type: "basic",
            name: "Error updating email",
            message: "There was an error updating the email",
            status: 500,
        });
    }
    return email;
};
export default updatteSingle;
//# sourceMappingURL=update-single.js.map