import https from "https";
const pipeRemoteURL = (data) => {
    return new Promise((resolve, reject) => {
        https
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
                    redirections: redirections + 1,
                })
                    .then(resolve)
                    .catch(reject);
                return;
            }
            if (statusCode !== 200) {
                reject(new Error(`Request failed. Status code: ${statusCode}`));
                return;
            }
            const contentType = response.headers["content-type"];
            if (contentType && !contentType.includes("image")) {
                reject(new Error("Content type is not an image"));
                return;
            }
            const chunks = [];
            response.on("data", (chunk) => {
                chunks.push(chunk);
            });
            response.on("end", () => {
                resolve({
                    buffer: Buffer.concat(chunks),
                    contentType,
                });
            });
            response.on("error", (error) => {
                reject(new Error("Error fetching the fallback image"));
            });
        })
            .on("error", (error) => {
            reject(new Error("Error with the HTTPS request"));
        });
    });
};
export default pipeRemoteURL;
//# sourceMappingURL=pipe-remote-url.js.map