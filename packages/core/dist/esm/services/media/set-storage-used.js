import service from "../../utils/app/service.js";
import mediaService from "../media/index.js";
import optionService from "../options/index.js";
const getStorageUsed = async (client, data) => {
    const storageUsed = await service(mediaService.getStorageUsed, false, client)();
    let newValue = (storageUsed || 0) + data.add;
    if (data.minus !== undefined) {
        newValue = newValue - data.minus;
    }
    const res = await service(optionService.patchByName, false, client)({
        name: "media_storage_used",
        value: newValue,
        type: "number",
    });
    return res.media_storage_used;
};
export default getStorageUsed;
//# sourceMappingURL=set-storage-used.js.map