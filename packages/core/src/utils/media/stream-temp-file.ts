import fs from "fs-extra";
import type { Readable } from "node:stream";

const streamTempFile = (filePath: string): Readable => {
	return fs.createReadStream(filePath);
};

export default streamTempFile;
