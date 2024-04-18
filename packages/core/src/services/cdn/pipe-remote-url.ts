import https from "node:https";

export interface ServiceData {
	url: string;
	redirections?: number;
}

const pipeRemoteUrl = async (
	data: ServiceData,
): Promise<{
	buffer: Buffer;
	contentType: string | undefined;
}> => {
	return new Promise((resolve, reject) => {
		https
			.get(data.url, (response) => {
				const { statusCode } = response;
				const redirections = data?.redirections || 0;

				if (
					statusCode &&
					statusCode >= 300 &&
					statusCode < 400 &&
					response.headers.location &&
					redirections < 5
				) {
					// Handle redirect, increase the redirection count, and try again
					pipeRemoteUrl({
						url: response.headers.location,
						redirections: redirections + 1,
					})
						.then(resolve)
						.catch(reject);
					return;
				}

				if (statusCode !== 200) {
					reject(
						new Error(`Request failed. Status code: ${statusCode}`),
					);
					return;
				}

				// verify content type is an image
				const contentType = response.headers["content-type"];

				if (contentType && !contentType.includes("image")) {
					reject(new Error("Content type is not an image"));
					return;
				}

				const chunks: Uint8Array[] = [];

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

export default pipeRemoteUrl;
