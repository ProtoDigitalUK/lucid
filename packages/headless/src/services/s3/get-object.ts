import T from "../../translations/index.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { type Readable } from "stream";
import getConfig from "../config.js";
import getS3Client from "../../clients/s3-client.js";

export interface ServiceData {
	key: string;
}

const getObject = async (data: ServiceData) => {
	try {
		const config = await getConfig();
		const S3 = await getS3Client;

		const command = new GetObjectCommand({
			Bucket: config.media.store.bucket,
			Key: data.key,
		});
		const response = await S3.send(command);

		return {
			success: true,
			message: T("object_successfully_saved"),
			response: {
				contentLength: response.ContentLength,
				contentType: response.ContentType,
				body: response.Body as Readable,
			},
		};
	} catch (e) {
		const error = e as Error;
		return {
			success: false,
			message: error.message,
			response: null,
		};
	}
};

export default getObject;
