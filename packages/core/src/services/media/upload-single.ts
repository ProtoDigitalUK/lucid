import { LucidAPIError } from "../../utils/error-handler.js";
import type { MultipartFile } from "@fastify/multipart";
import localesServices from "../locales/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import mediaServices from "./index.js";
import translationsServices from "../translations/index.js";
import {
	mergeTranslationGroups,
	getUniquelocaleCodes,
} from "../../utils/translation-helpers.js";
import type { BooleanInt } from "../../libs/db/types.js";
import Repository from "../../libs/repositories/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	fileData: MultipartFile | undefined;
	titleTranslations?: {
		localeCode: string;
		value: string | null;
	}[];
	altTranslations?: {
		localeCode: string;
		value: string | null;
	}[];
	visible?: BooleanInt;
}

const uploadSingle = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	let objectStored = false;
	let objectKey = undefined;

	try {
		const MediaRepo = Repository.get("media", serviceConfig.db);

		await serviceWrapper(localesServices.checks.checkLocalesExist, false)(
			serviceConfig,
			{
				localeCodes: getUniquelocaleCodes([
					data.titleTranslations || [],
					data.altTranslations || [],
				]),
			},
		);

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
			throw new LucidAPIError({
				type: "basic",
				status: 500,
			});
		}

		return mediaRes.id;
	} catch (e) {
		if (objectStored && objectKey !== undefined) {
			serviceConfig.config.media?.strategy?.deleteSingle(objectKey);
		}
		throw e;
	}
};

export default uploadSingle;
