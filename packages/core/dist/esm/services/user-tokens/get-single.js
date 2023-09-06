import { LucidError } from "../../utils/app/error-handler.js";
import UserToken from "../../db/models/UserToken.js";
const getSingle = async (client, data) => {
    const userToken = await UserToken.getByToken(client, {
        token_type: data.token_type,
        token: data.token,
    });
    if (!userToken) {
        throw new LucidError({
            type: "basic",
            name: "Invalid token",
            message: "The provided token is either invalid or expired. Please try again.",
            status: 400,
        });
    }
    return userToken;
};
export default getSingle;
//# sourceMappingURL=get-single.js.map