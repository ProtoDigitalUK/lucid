import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import mediaServices from "./index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import translationsServices from "../translations/index.js";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	id: number;
}

const deleteSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const mediaStategy = mediaServices.checks.checkHasMediaStrategy({
		config: serviceConfig.config,
	});

	const MediaRepo = Repository.get("media", serviceConfig.db);
	const ProcessedImagesRepo = Repository.get(
		"processed-images",
		serviceConfig.db,
	);

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

	const allProcessedImages = await ProcessedImagesRepo.selectMultiple({
		select: ["key"],
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
		throw new APIError({
			type: "basic",
			name: T("error_not_deleted_name", {
				name: T("media"),
			}),
			message: T("deletion_error_message", {
				name: T("media").toLowerCase(),
			}),
			status: 500,
		});
	}

	await Promise.all([
		mediaStategy.deleteMultiple(allProcessedImages.map((i) => i.key)),
		serviceWrapper(mediaServices.storage.deleteObject, false)(
			serviceConfig,
			{
				key: deleteMedia.key,
				size: deleteMedia.file_size,
			},
		),
		serviceWrapper(translationsServices.deleteMultiple, false)(
			serviceConfig,
			{
				ids: [
					deleteMedia.title_translation_key_id,
					deleteMedia.alt_translation_key_id,
				],
			},
		),
	]);
};

export default deleteSingle;
