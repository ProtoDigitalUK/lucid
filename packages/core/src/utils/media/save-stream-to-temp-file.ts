import fs from "fs-extra";
import constants from "../../constants/constants.js";
import { pipeline } from "node:stream/promises";
import { join } from "node:path";
import type { Readable } from "node:stream";

const saveStreamToTempFile = async (stream: Readable, name: string) => {
	await fs.ensureDir(constants.tempDir);
	const tempFilePath = join(constants.tempDir, name);
	await pipeline(stream, fs.createWriteStream(tempFilePath));
	return tempFilePath;
};

export default saveStreamToTempFile;
