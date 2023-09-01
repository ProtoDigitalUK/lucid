"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const pipeRemoteURL = (data) => {
    https_1.default
        .get(data.url, (response) => {
        const { statusCode } = response;
        const redirections = data?.redirections || 0;
        if (statusCode &&
            statusCode >= 300 &&
            statusCode < 400 &&
            response.headers.location &&
            redirections < 5) {
            pipeRemoteURL({
                url: response.headers.location,
                res: data.res,
                redirections: redirections + 1,
            });
            return;
        }
        if (statusCode !== 200) {
            throw new Error(`Request failed. Status code: ${statusCode}`);
        }
        const contentType = response.headers["content-type"];
        if (contentType) {
            data.res.setHeader("Content-Type", contentType);
        }
        response.on("error", (error) => {
            throw new Error("Error fetching the fallback image");
        });
        response.pipe(data.res);
    })
        .on("error", (error) => {
        throw new Error("Error with the HTTPS request");
    });
};
exports.default = pipeRemoteURL;
//# sourceMappingURL=pipe-remote-url.js.map