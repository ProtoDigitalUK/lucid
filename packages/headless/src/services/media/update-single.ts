import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import { type MultipartFile } from "@fastify/multipart";
import languagesServices from "../languages/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import mediaServices from "./index.js";
import translationsServices from "../translations/index.js";
import s3Services from "../s3/index.js";

export interface ServiceData {
	id: number;
	fileData: MultipartFile | undefined;
	translations?: Array<{
		language_id: number;
		value: string | null;
		key: "title" | "alt";
	}>;
}

const updateSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	// if translations are present, insert on conflict update
	// do translations first so if they throw an error, the file is not uploaded
	// if the file upload throws an error, the translations are not inserted due to the transaction

	const media = await serviceConfig.db
		.selectFrom("headless_media")
		.select((eb) => [
			"id",
			"key",
			"file_size",
			"title_translation_key_id",
			"alt_translation_key_id",
		])
		.where("id", "=", data.id)
		.executeTakeFirst();

	if (media === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("media"),
			}),
			message: T("error_not_found_message", {
				name: T("media"),
			}),
			status: 404,
		});
	}

	if (data.translations !== undefined && data.translations.length > 0) {
		await serviceWrapper(
			languagesServices.checks.checkLanguagesExist,
			false,
		)(serviceConfig, {
			languageIds: data.translations?.map((t) => t.language_id) || [],
		});
		await serviceWrapper(translationsServices.upsertMultiple, false)(
			serviceConfig,
			{
				keys: {
					title: media.title_translation_key_id,
					alt: media.alt_translation_key_id,
				},
				translations: data.translations,
			},
		);
	}

	if (data.fileData === undefined) {
		return;
	}
	console.log("data.fileData is undefined", data.fileData);

	const updateObjectRes = await serviceWrapper(
		mediaServices.storage.updateObject,
		false,
	)(serviceConfig, {
		fileData: data.fileData,
		previousSize: media.file_size,
		key: media.key,
	});

	const mediaUpdateRes = await serviceConfig.db
		.updateTable("headless_media")
		.set({
			key: updateObjectRes.key,
			e_tag: updateObjectRes.etag,
			type: updateObjectRes.type,
			mime_type: updateObjectRes.mimeType,
			file_extension: updateObjectRes.fileExtension,
			file_size: updateObjectRes.size,
			width: updateObjectRes.width,
			height: updateObjectRes.height,
			updated_at: new Date(),
		})
		.returning("id")
		.executeTakeFirst();

	if (mediaUpdateRes === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("media"),
			}),
			message: T("error_not_created_message", {
				name: T("media"),
			}),
			status: 500,
		});
	}

	return mediaUpdateRes.id;
};

export default updateSingle;
