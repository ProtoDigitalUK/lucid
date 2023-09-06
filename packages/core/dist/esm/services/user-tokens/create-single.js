import crypto from "crypto";
import { LucidError } from "../../utils/app/error-handler.js";
import UserToken from "../../db/models/UserToken.js";
const createSingle = async (client, data) => {
    const token = crypto.randomBytes(32).toString("hex");
    const userToken = await UserToken.createSingle(client, {
        user_id: data.user_id,
        token_type: data.token_type,
        token,
        expiry_date: data.expiry_date,
    });
    if (!userToken) {
        throw new LucidError({
            type: "basic",
            name: "Error creating user token",
            message: "There was an error creating the user token.",
            status: 500,
        });
    }
    return userToken;
};
export default createSingle;
//# sourceMappingURL=create-single.js.map