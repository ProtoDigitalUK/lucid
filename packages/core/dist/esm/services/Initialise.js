import service from "../utils/app/service.js";
import userServices from "./users/index.js";
const Initialise = async (client) => {
    const users = await service(userServices.getMultiple, false, client)({
        query: {},
    });
    if (users.count === 0) {
        await service(userServices.registerSingle, false, client)({
            first_name: "Lucid",
            last_name: "Admin",
            email: "admin@lucid.com",
            username: "admin",
            password: "password",
            super_admin: true,
        });
    }
};
export default Initialise;
//# sourceMappingURL=Initialise.js.map