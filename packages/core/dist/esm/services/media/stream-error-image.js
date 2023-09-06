import fs from "fs-extra";
import path from "path";
import { LucidError } from "../../utils/app/error-handler.js";
import { decodeError } from "../../utils/app/error-handler.js";
import Config from "../Config.js";
import mediaService from "../media/index.js";
const pipeLocalImage = (res) => {
    let pathVal = path.join(__dirname, "../../assets/404.jpg");
    let contentType = "image/jpeg";
    const steam = fs.createReadStream(pathVal);
    res.setHeader("Content-Type", contentType);
    steam.pipe(res);
};
const streamErrorImage = async (data) => {
    const error = decodeError(data.error);
    if (error.status !== 404) {
        data.next(data.error);
        return;
    }
    if (Config.media.fallbackImage === false || data.fallback === "0") {
        data.next(new LucidError({
            type: "basic",
            name: "Error",
            message: "We're sorry, but this image is not available.",
            status: 404,
        }));
        return;
    }
    if (Config.media.fallbackImage === undefined) {
        pipeLocalImage(data.res);
        return;
    }
    try {
        const { buffer, contentType } = await mediaService.pipeRemoteURL({
            url: Config.media.fallbackImage,
        });
        data.res.setHeader("Content-Type", contentType || "image/jpeg");
        data.res.send(buffer);
    }
    catch (err) {
        pipeLocalImage(data.res);
        return;
    }
};
export default streamErrorImage;
//# sourceMappingURL=stream-error-image.js.map