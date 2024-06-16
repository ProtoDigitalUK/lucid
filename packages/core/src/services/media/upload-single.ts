import localesServices from "../locales/index.js";
import mediaServices from "./index.js";
import translationsServices from "../translations/index.js";
import {
	mergeTranslationGroups,
	getUniquelocaleCodes,
} from "../../utils/translation-helpers.js";
import Repository from "../../libs/repositories/index.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import type { BooleanInt } from "../../libs/db/types.js";
import type { MultipartFile } from "@fastify/multipart";
import type { ServiceFn } from "../../libs/services/types.js";

const uploadSingle: ServiceFn<
	[
		{
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
		},
	],
	number
> = async (serviceConfig, data) => {
	let objectStored = false;
	let objectKey = undefined;

	try {
		const MediaRepo = Repository.get("media", serviceConfig.db);

		const localeExistsRes = await serviceWrapper(
			localesServices.checks.checkLocalesExist,
			{
				transaction: false,
			},
		)(serviceConfig, {
			localeCodes: getUniquelocaleCodes([
				data.titleTranslations || [],
				data.altTranslations || [],
			]),
		});
		if (localeExistsRes.error) return localeExistsRes;

		const translationKeyIdPromise = serviceWrapper(
			translationsServices.createMultiple,
			{
				transaction: false,
			},
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
			{
				transaction: false,
			},
		)(serviceConfig, {
			fileData: data.fileData,
		});

		const [translationKeyIdsRes, uploadObjectRes] = await Promise.all([
			translationKeyIdPromise,
			uploadObjectPromise,
		]);
		if (translationKeyIdsRes.error) return translationKeyIdsRes;
		if (uploadObjectRes.error) return uploadObjectRes;

		objectStored = true;
		objectKey = uploadObjectRes.data.key;

		const mediaRes = await MediaRepo.createSingle({
			key: uploadObjectRes.data.key,
			eTag: uploadObjectRes.data.etag,
			visible: data.visible ?? 1,
			type: uploadObjectRes.data.type,
			mimeType: uploadObjectRes.data.mimeType,
			fileExtension: uploadObjectRes.data.fileExtension,
			fileSize: uploadObjectRes.data.size,
			width: uploadObjectRes.data.width,
			height: uploadObjectRes.data.height,
			titleTranslationKeyId: translationKeyIdsRes.data.title,
			altTranslationKeyId: translationKeyIdsRes.data.alt,
		});

		if (mediaRes === undefined) {
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
			data: mediaRes.id,
		};
	} catch (e) {
		if (objectStored && objectKey !== undefined) {
			serviceConfig.config.media?.strategy?.deleteSingle(objectKey);
		}

		return {
			error: {
				type: "basic",
				status: 500,
			},
			data: undefined,
		};
	}
};

export default uploadSingle;
