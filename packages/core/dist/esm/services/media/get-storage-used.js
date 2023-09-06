import service from "../../utils/app/service.js";
import optionServices from "../options/index.js";
const getStorageUsed = async (client) => {
    const res = await service(optionServices.getByName, false, client)({
        name: "media_storage_used",
    });
    return res.media_storage_used;
};
export default getStorageUsed;
//# sourceMappingURL=get-storage-used.js.map