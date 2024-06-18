import T from "../../translations/index.js";
import lucidServices from "../index.js";
import Repository from "../../libs/repositories/index.js";
import type { ServiceFn } from "../../libs/services/types.js";

const deleteSingle: ServiceFn<
	[
		{
			id: number;
		},
	],
	undefined
> = async (service, data) => {
	const mediaStrategyRes =
		await lucidServices.media.checks.checkHasMediaStrategy(service);
	if (mediaStrategyRes.error) return mediaStrategyRes;

	const MediaRepo = Repository.get("media", service.db);
	const ProcessedImagesRepo = Repository.get("processed-images", service.db);

	const getMedia = await MediaRepo.selectSingle({
		select: ["key"],
		where: [
			{
				key: "id",
				operator: "=",
				value: data.id,
			},
		],
	});

	if (getMedia === undefined) {
		return {
			error: {
				type: "basic",
				message: T("media_not_found_message"),
				status: 404,
			},
			data: undefined,
		};
	}

	const allProcessedImages = await ProcessedImagesRepo.selectMultiple({
		select: ["key", "file_size"],
		where: [
			{
				key: "media_key",
				operator: "=",
				value: getMedia.key,
			},
		],
	});
	const deleteMedia = await MediaRepo.deleteSingle({
		where: [
			{
				key: "id",
				operator: "=",
				value: data.id,
			},
		],
	});

	if (deleteMedia === undefined) {
		return {
			error: {
				type: "basic",
				status: 500,
			},
			data: undefined,
		};
	}

	const [_, deleteObjectRes, deleteTranslationsRes] = await Promise.all([
		mediaStrategyRes.data.deleteMultiple(
			allProcessedImages.map((i) => i.key),
		),
		lucidServices.media.storage.deleteObject(service, {
			key: deleteMedia.key,
			size: deleteMedia.file_size,
			processedSize: allProcessedImages.reduce(
				(acc, i) => acc + i.file_size,
				0,
			),
		}),
		lucidServices.translation.deleteMultiple(service, {
			ids: [
				deleteMedia.title_translation_key_id,
				deleteMedia.alt_translation_key_id,
			],
		}),
	]);
	if (deleteObjectRes.error) return deleteObjectRes;
	if (deleteTranslationsRes.error) return deleteTranslationsRes;

	return {
		error: undefined,
		data: undefined,
	};
};

export default deleteSingle;
