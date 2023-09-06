import helpers from "../../utils/media/helpers.js";
import service from "../../utils/app/service.js";
import { LucidError, modelErrors } from "../../utils/app/error-handler.js";
import Media from "../../db/models/Media.js";
import mediaService from "../media/index.js";
import s3Service from "../s3/index.js";
import formatMedia from "../../utils/format/format-media.js";
const createSingle = async (client, data) => {
    if (!data.files || !data.files["file"]) {
        throw new LucidError({
            type: "basic",
            name: "No files provided",
            message: "No files provided",
            status: 400,
            errors: modelErrors({
                file: {
                    code: "required",
                    message: "No files provided",
                },
            }),
        });
    }
    const files = helpers.formatReqFiles(data.files);
    const firstFile = files[0];
    await service(mediaService.canStoreFiles, false, client)({
        files,
    });
    const key = helpers.uniqueKey(data.name || firstFile.name);
    const meta = await helpers.getMetaData(firstFile);
    const type = helpers.getMediaType(meta.mimeType);
    const response = await s3Service.saveObject({
        type: "file",
        key: key,
        file: firstFile,
        meta,
    });
    if (response.$metadata.httpStatusCode !== 200) {
        throw new LucidError({
            type: "basic",
            name: "Error saving file",
            message: "Error saving file",
            status: 500,
            errors: modelErrors({
                file: {
                    code: "required",
                    message: "Error saving file",
                },
            }),
        });
    }
    const media = await Media.createSingle(client, {
        key: key,
        name: data.name || firstFile.name,
        alt: data.alt,
        etag: response.ETag?.replace(/"/g, ""),
        type: type,
        meta: meta,
    });
    if (!media) {
        await s3Service.deleteObject({
            key,
        });
        throw new LucidError({
            type: "basic",
            name: "Error saving file",
            message: "Error saving file",
            status: 500,
            errors: modelErrors({
                file: {
                    code: "required",
                    message: "Error saving file",
                },
            }),
        });
    }
    await service(mediaService.setStorageUsed, false, client)({
        add: meta.size,
    });
    return formatMedia(media);
};
export default createSingle;
//# sourceMappingURL=create-single.js.map