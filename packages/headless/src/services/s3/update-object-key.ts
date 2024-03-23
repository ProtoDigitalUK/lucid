import T from "../../translations/index.js";
import { DeleteObjectCommand, CopyObjectCommand } from "@aws-sdk/client-s3";
import getConfig from "../../libs/config/get-config.js";
import getS3Client from "../../clients/s3-client.js";

export interface ServiceData {
	newKey: string;
	oldKey: string;
}

const updateObjectKey = async (data: ServiceData) => {
	try {
		const config = await getConfig();
		const S3 = await getS3Client;

		const copyCommand = new CopyObjectCommand({
			Bucket: config.media.store.bucket,
			CopySource: `${config.media.store.bucket}/${data.oldKey}`,
			Key: data.newKey,
		});
		await S3.send(copyCommand);

		const command = new DeleteObjectCommand({
			Bucket: config.media.store.bucket,
			Key: data.oldKey,
		});

		await S3.send(command);

		return {
			success: true,
			message: T("object_successfully_updated"),
		};
	} catch (e) {
		const error = e as Error;
		return {
			success: false,
			message: error.message,
		};
	}
};

export default updateObjectKey;
