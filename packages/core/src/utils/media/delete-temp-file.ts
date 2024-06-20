import fs from "fs-extra";

const deleteTempFile = async (filePath?: string) => {
	if (!filePath) return;
	await fs.remove(filePath);
};

export default deleteTempFile;
