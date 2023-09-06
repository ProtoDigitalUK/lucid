import service from "../../utils/app/service.js";
import { LucidError, modelErrors } from "../../utils/app/error-handler.js";
import Config from "../Config.js";
import mediaService from "../media/index.js";
const canStoreFiles = async (client, data) => {
    const { storageLimit, maxFileSize } = Config.media;
    for (let i = 0; i < data.files.length; i++) {
        const file = data.files[i];
        if (file.size > maxFileSize) {
            const message = `File ${file.name} is too large. Max file size is ${maxFileSize} bytes.`;
            throw new LucidError({
                type: "basic",
                name: "Error saving file",
                message: message,
                status: 500,
                errors: modelErrors({
                    file: {
                        code: "storage_limit",
                        message: message,
                    },
                }),
            });
        }
    }
    const storageUsed = await service(mediaService.getStorageUsed, false, client)();
    const totalSize = data.files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize + (storageUsed || 0) > storageLimit) {
        const message = `Files exceed storage limit. Max storage limit is ${storageLimit} bytes.`;
        throw new LucidError({
            type: "basic",
            name: "Error saving file",
            message: message,
            status: 500,
            errors: modelErrors({
                file: {
                    code: "storage_limit",
                    message: message,
                },
            }),
        });
    }
};
export default canStoreFiles;
//# sourceMappingURL=can-store-files.js.map