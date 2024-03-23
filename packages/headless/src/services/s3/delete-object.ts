import T from "../../translations/index.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import getConfig from "../../libs/config/get-config.js";
import getS3Client from "../../clients/s3-client.js";

export interface ServiceData {
	key: string;
}

const deleteObject = async (data: ServiceData) => {
	try {
		const config = await getConfig();
		const S3 = await getS3Client;

		const command = new DeleteObjectCommand({
			Bucket: config.media.store.bucket,
			Key: data.key,
		});

		await S3.send(command);

		return {
			success: true,
			message: T("object_successfully_deleted"),
		};
	} catch (e) {
		const error = e as Error;
		return {
			success: false,
			message: error.message,
		};
	}
};

export default deleteObject;
