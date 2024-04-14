import T from "../../translations/index.js";
import { HeadlessAPIError } from "../../utils/error-handler.js";
import type { MultipartFile } from "@fastify/multipart";
import languagesServices from "../languages/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import mediaServices from "./index.js";
import translationsServices from "../translations/index.js";
import {
	mergeTranslationGroups,
	getUniqueLanguageIDs,
} from "../../utils/translation-helpers.js";
import type { BooleanInt } from "../../libs/db/types.js";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	fileData: MultipartFile | undefined;
	titleTranslations?: {
		languageId: number;
		value: string | null;
	}[];
	altTranslations?: {
		languageId: number;
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
			languageIds: getUniqueLanguageIDs([
				data.titleTranslations || [],
				data.altTranslations || [],
			]),
		});

		const translationKeyIdPromise = serviceWrapper(
			translationsServices.createMultiple,
			false,
		)(serviceConfig, {
			keys: ["title", "alt"],
			translations: mergeTranslationGroups([
				{
					translations: data.titleTranslations || [],
					key: "title",
				},
				{
					translations: data.altTranslations || [],
					key: "alt",
				},
			]),
		});
		const uploadObjectPromise = serviceWrapper(
			mediaServices.storage.uploadObject,
			false,
		)(serviceConfig, {
			fileData: data.fileData,
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
			throw new HeadlessAPIError({
				type: "basic",
				status: 500,
			});
		}

		return mediaRes.id;
	} catch (e) {
		if (objectStored && objectKey !== undefined) {
			serviceConfig.config.media?.stategy?.deleteSingle(objectKey);
		}
		throw e;
	}
};

export default uploadSingle;
