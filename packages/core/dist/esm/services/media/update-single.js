import helpers from "../../utils/media/helpers.js";
import { LucidError, modelErrors } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import Media from "../../db/models/Media.js";
import mediaService from "../media/index.js";
import s3Service from "../s3/index.js";
import processedImagesService from "../processed-images/index.js";
const updateSingle = async (client, data) => {
    const media = await service(mediaService.getSingle, false, client)({
        id: data.id,
    });
    let meta = undefined;
    let newKey = undefined;
    let newType = undefined;
    if (data.data.files && data.data.files["file"]) {
        const files = helpers.formatReqFiles(data.data.files);
        const firstFile = files[0];
        await service(mediaService.canStoreFiles, false, client)({
            files,
        });
        meta = await helpers.getMetaData(firstFile);
        newKey = helpers.uniqueKey(data.data.name || firstFile.name);
        newType = helpers.getMediaType(meta.mimeType);
        const updateKeyRes = await s3Service.updateObjectKey({
            oldKey: media.key,
            newKey: newKey,
        });
        if (updateKeyRes.$metadata.httpStatusCode !== 200) {
            throw new LucidError({
                type: "basic",
                name: "Error updating file",
                message: "There was an error updating the file.",
                status: 500,
                errors: modelErrors({
                    file: {
                        code: "required",
                        message: "There was an error updating the file.",
                    },
                }),
            });
        }
        const response = await s3Service.saveObject({
            type: "file",
            key: newKey,
            file: firstFile,
            meta,
        });
        if (response.$metadata.httpStatusCode !== 200) {
            throw new LucidError({
                type: "basic",
                name: "Error updating file",
                message: "There was an error updating the file.",
                status: 500,
                errors: modelErrors({
                    file: {
                        code: "required",
                        message: "There was an error updating the file.",
                    },
                }),
            });
        }
        await service(mediaService.setStorageUsed, false, client)({
            add: meta.size,
            minus: media.meta.file_size,
        });
        await service(processedImagesService.clearSingle, false, client)({
            id: media.id,
        });
    }
    const mediaUpdate = await Media.updateSingle(client, {
        key: media.key,
        name: data.data.name,
        alt: data.data.alt,
        meta: meta,
        type: newType,
        newKey: newKey,
    });
    if (!mediaUpdate) {
        throw new LucidError({
            type: "basic",
            name: "Error updating media",
            message: "There was an error updating the media.",
            status: 500,
        });
    }
    return undefined;
};
export default updateSingle;
//# sourceMappingURL=update-single.js.map