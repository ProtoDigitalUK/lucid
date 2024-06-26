import T from "../../translations/index.js";
import Repository from "../../libs/repositories/index.js";
import type { MultipartFile } from "@fastify/multipart";
import type { ServiceFn } from "../../utils/services/types.js";

const updateSingle: ServiceFn<
	[
		{
			id: number;
			fileData: MultipartFile | undefined;
			titleTranslations?: {
				localeCode: string;
				value: string | null;
			}[];
			altTranslations?: {
				localeCode: string;
				value: string | null;
			}[];
		},
	],
	number | undefined
> = async (context, data) => {
	// if translations are present, insert on conflict update
	// do translations first so if they throw an error, the file is not uploaded
	// if the file upload throws an error, the translations are not inserted due to the transaction
	const MediaRepo = Repository.get("media", context.db);

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
		return {
			error: {
				type: "basic",
				message: T("media_not_found_message"),
				status: 404,
			},
			data: undefined,
		};
	}

	const upsertTranslationsRes =
		await context.services.translation.upsertMultiple(context, {
			keys: {
				title: media.title_translation_key_id,
				alt: media.alt_translation_key_id,
			},
			items: [
				{
					translations: data.titleTranslations || [],
					key: "title",
				},
				{
					translations: data.altTranslations || [],
					key: "alt",
				},
			],
		});
	if (upsertTranslationsRes.error) return upsertTranslationsRes;

	if (data.fileData === undefined) {
		return {
			error: undefined,
			data: undefined,
		};
	}

	const updateObjectRes = await context.services.media.storage.updateObject(
		context,
		{
			fileData: data.fileData,
			previousSize: media.file_size,
			key: media.key,
		},
	);
	if (updateObjectRes.error) return updateObjectRes;

	const mediaUpdateRes = await MediaRepo.updateSingle({
		where: [
			{
				key: "id",
				operator: "=",
				value: data.id,
			},
		],
		data: {
			key: updateObjectRes.data.key,
			eTag: updateObjectRes.data.etag,
			type: updateObjectRes.data.type,
			mimeType: updateObjectRes.data.mimeType,
			fileExtension: updateObjectRes.data.fileExtension,
			fileSize: updateObjectRes.data.size,
			width: updateObjectRes.data.width,
			height: updateObjectRes.data.height,
			updatedAt: new Date().toISOString(),
		},
	});

	if (mediaUpdateRes === undefined) {
		return {
			error: {
				type: "basic",
				status: 500,
			},
			data: undefined,
		};
	}

	return {
		error: undefined,
		data: mediaUpdateRes.id,
	};
};

export default updateSingle;
