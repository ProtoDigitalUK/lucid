import type { Readable } from "node:stream";

const streamToBuffer = (readable: Readable): Promise<Buffer> => {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = [];
		readable.on("data", (chunk) => chunks.push(chunk));
		readable.on("end", () => resolve(Buffer.concat(chunks)));
		readable.on("error", reject);
	});
};

export default streamToBuffer;
