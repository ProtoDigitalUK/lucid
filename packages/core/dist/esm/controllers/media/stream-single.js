import mediaSchema from "../../schemas/media.js";
import mediaService from "../../services/media/index.js";
const streamSingleController = async (req, res, next) => {
    try {
        const response = await mediaService.streamMedia({
            key: req.params.key,
            query: req.query,
        });
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        if (response !== undefined) {
            res.setHeader("Content-Disposition", `inline; filename="${req.params.key}"`);
            if (response?.contentLength)
                res.setHeader("Content-Length", response.contentLength);
            if (response?.contentType)
                res.setHeader("Content-Type", response.contentType);
            if (response?.body !== undefined)
                response.body.pipe(res);
        }
    }
    catch (error) {
        await mediaService.streamErrorImage({
            fallback: req.query?.fallback,
            error: error,
            res: res,
            next: next,
        });
    }
};
export default {
    schema: mediaSchema.streamSingle,
    controller: streamSingleController,
};
//# sourceMappingURL=stream-single.js.map