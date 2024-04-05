import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import type { MultipartFile } from "@fastify/multipart";
import serviceWrapper from "../../utils/service-wrapper.js";
import mediaServices from "./index.js";
import translationsServices from "../translations/index.js";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	id: number;
	file_data: MultipartFile | undefined;
	title_translations?: {
		language_id: number;
		value: string | null;
	}[];
	alt_translations?: {
		language_id: number;
		value: string | null;
	}[];
}

const updateSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	// if translations are present, insert on conflict update
	// do translations first so if they throw an error, the file is not uploaded
	// if the file upload throws an error, the translations are not inserted due to the transaction
	const MediaRepo = Repository.get("media", serviceConfig.db);

	const media = await MediaRepo.selectSingle({
		select: [
			"id",
			"key",
			"file_size",
			"title_translation_key_id",
			"alt_translation_key_id",
		],
		where: [
			{
				key: "id",
				operator: "=",
				value: data.id,
			},
		],
	});

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

	await serviceWrapper(translationsServices.upsertMultiple, false)(
		serviceConfig,
		{
			keys: {
				title: media.title_translation_key_id,
				alt: media.alt_translation_key_id,
			},
			items: [
				{
					translations: data.title_translations || [],
					key: "title",
				},
				{
					translations: data.alt_translations || [],
					key: "alt",
				},
			],
		},
	);

	if (data.file_data === undefined) {
		return;
	}

	const updateObjectRes = await serviceWrapper(
		mediaServices.storage.updateObject,
		false,
	)(serviceConfig, {
		file_data: data.file_data,
		previous_size: media.file_size,
		key: media.key,
	});

	const mediaUpdateRes = await MediaRepo.updateSingle({
		where: [
			{
				key: "id",
				operator: "=",
				value: data.id,
			},
		],
		data: {
			key: updateObjectRes.key,
			eTag: updateObjectRes.etag,
			type: updateObjectRes.type,
			mimeType: updateObjectRes.mimeType,
			fileExtension: updateObjectRes.fileExtension,
			fileSize: updateObjectRes.size,
			width: updateObjectRes.width,
			height: updateObjectRes.height,
			updatedAt: new Date().toISOString(),
		},
	});

	if (mediaUpdateRes === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_updated_name", {
				name: T("media"),
			}),
			message: T("update_error_message", {
				name: T("media").toLowerCase(),
			}),
			status: 500,
		});
	}

	return mediaUpdateRes.id;
};

export default updateSingle;
