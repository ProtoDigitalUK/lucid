import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import type { MultipartFile } from "@fastify/multipart";
import languagesServices from "../languages/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import mediaServices from "./index.js";
import translationsServices from "../translations/index.js";
import s3Services from "../s3/index.js";
import {
	mergeTranslationGroups,
	getUniqueLanguageIDs,
} from "../../utils/translation-helpers.js";
import type { BooleanInt } from "../../libs/db/types.js";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	file_data: MultipartFile | undefined;
	title_translations?: {
		language_id: number;
		value: string | null;
	}[];
	alt_translations?: {
		language_id: number;
		value: string | null;
	}[];
	visible?: BooleanInt;
}

const uploadSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	let objectStored = false;
	let objectKey = undefined;

	try {
		const MediaRepo = Repository.get("media", serviceConfig.db);

		await serviceWrapper(
			languagesServices.checks.checkLanguagesExist,
			false,
		)(serviceConfig, {
			language_ids: getUniqueLanguageIDs([
				data.title_translations || [],
				data.alt_translations || [],
			]),
		});

		const translationKeyIdPromise = serviceWrapper(
			translationsServices.createMultiple,
			false,
		)(serviceConfig, {
			keys: ["title", "alt"],
			translations: mergeTranslationGroups([
				{
					translations: data.title_translations || [],
					key: "title",
				},
				{
					translations: data.alt_translations || [],
					key: "alt",
				},
			]),
		});
		const uploadObjectPromise = serviceWrapper(
			mediaServices.storage.uploadObject,
			false,
		)(serviceConfig, {
			file_data: data.file_data,
		});

		const [translationKeyIds, uploadObjectRes] = await Promise.all([
			translationKeyIdPromise,
			uploadObjectPromise,
		]);

		objectStored = true;
		objectKey = uploadObjectRes.key;

		const mediaRes = await MediaRepo.createSingle({
			key: uploadObjectRes.key,
			eTag: uploadObjectRes.etag,
			visible: data.visible ?? 1,
			type: uploadObjectRes.type,
			mimeType: uploadObjectRes.mimeType,
			fileExtension: uploadObjectRes.fileExtension,
			fileSize: uploadObjectRes.size,
			width: uploadObjectRes.width,
			height: uploadObjectRes.height,
			titleTranslationKeyId: translationKeyIds.title,
			altTranslationKeyId: translationKeyIds.alt,
		});

		if (mediaRes === undefined) {
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

		return mediaRes.id;
	} catch (e) {
		if (objectStored && objectKey !== undefined) {
			s3Services.deleteObject({
				key: objectKey,
			});
		}
		throw e;
	}
};

export default uploadSingle;
