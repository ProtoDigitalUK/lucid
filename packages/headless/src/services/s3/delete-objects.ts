import T from "../../translations/index.js";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import getConfig from "../../libs/config/get-config.js";
import getS3Client from "../../clients/s3-client.js";

export interface ServiceData {
	objects: Array<{
		key: string;
	}>;
}

const deleteObjects = async (data: ServiceData) => {
	try {
		const config = await getConfig();
		const S3 = await getS3Client;

		const command = new DeleteObjectsCommand({
			Bucket: config.media.store.bucket,
			Delete: {
				Objects: data.objects.map((object) => ({
					Key: object.key,
				})),
			},
		});

		await S3.send(command);

		return {
			success: true,
			message: T("objects_successfully_deleted"),
		};
	} catch (e) {
		const error = e as Error;
		return {
			success: false,
			message: error.message,
		};
	}
};

export default deleteObjects;
