import T from "../../translations/index.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { type Readable } from "stream";
import { type MediaMetaDataT } from "../../utils/media/helpers.js";
import getConfig from "../config.js";
import getS3Client from "../../clients/s3-client.js";

export interface ServiceData {
	type: "readable" | "buffer";

	key: string;
	readable?: Readable;
	buffer?: Buffer;
	meta: MediaMetaDataT;
}

const saveObject = async (data: ServiceData) => {
	try {
		const config = await getConfig();
		const S3 = await getS3Client;

		const command = new PutObjectCommand({
			Bucket: config.media.store.bucket,
			Key: data.key,
			Body: data.type === "readable" ? data.readable : data.buffer,
			ContentType: data.meta.mimeType,
			Metadata: {
				width: data.meta.width?.toString() || "",
				height: data.meta.height?.toString() || "",
				extension: data.meta.fileExtension,
			},
		});
		const response = await S3.send(command);

		return {
			success: true,
			message: T("object_successfully_saved"),
			etag: response.ETag?.replace(/"/g, ""),
		};
	} catch (e) {
		const error = e as Error;
		return {
			success: false,
			message: error.message,
		};
	}
};

export default saveObject;
