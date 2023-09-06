import UserToken from "../../db/models/UserToken.js";
const deleteSingle = async (client, data) => {
    const userToken = await UserToken.deleteSingle(client, {
        id: data.id,
    });
    return userToken;
};
export default deleteSingle;
//# sourceMappingURL=delete-single.js.map