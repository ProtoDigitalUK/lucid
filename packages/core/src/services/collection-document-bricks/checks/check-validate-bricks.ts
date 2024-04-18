import T from "../../../translations/index.js";
import type z from "zod";
import { HeadlessAPIError } from "../../../utils/error-handler.js";
import type { FieldErrors } from "../../../types/errors.js";
import collectionsServices from "../../collections/index.js";
import type {
	ValidationProps,
	MediaReferenceData,
	LinkReferenceData,
	FieldTypes,
} from "../../../libs/builders/field-builder/index.js";
import type { PageLinkValue, LinkValue } from "../../../types/response.js";
import type CollectionBuilder from "../../../libs/builders/collection-builder/index.js";
import type { BrickSchema } from "../../../schemas/collection-bricks.js";
import type { FieldSchema } from "../../../schemas/collection-fields.js";
import type { ServiceConfig } from "../../../utils/service-wrapper.js";
import Repository from "../../../libs/repositories/index.js";

export interface ServiceData {
	bricks: Array<BrickSchema>;
	collectionKey: string;
}

const validateBricks = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const flatFields =
		data.bricks.flatMap((brick) => {
			return brick.fields || [];
		}) || [];

	const [collection, media, documents] = await Promise.all([
		collectionsServices.getSingleInstance({
			key: data.collectionKey,
		}),
		getAllMedia(serviceConfig, flatFields),
		getAllDocuments(serviceConfig, flatFields),
	]);

	// validate bricks
	const { errors, hasErrors } = await validateBrickData({
		bricks: data.bricks,
		collection: collection,
		media: media,
		documents: documents,
	});

	// If there are errors, throw them
	if (hasErrors) {
		throw new HeadlessAPIError({
			type: "basic",
			name: T("error_saving_bricks"),
			message: T("there_was_an_error_updating_bricks"),
			status: 400,
			errorResponse: {
				body: {
					fields: errors,
				},
			},
		});
	}
};

const validateBrickData = async (data: {
	bricks: BrickSchema[];
	collection: CollectionBuilder;
	media: Array<{
		id: number;
		file_extension: string;
		width: number | null;
		height: number | null;
		type: string;
	}>;
	documents: {
		id: number;
	}[];
}) => {
	const errors: FieldErrors[] = [];
	let hasErrors = false;

	for (let i = 0; i < data.bricks.length; i++) {
		const brick = data.bricks[i];

		if (brick === undefined) continue;

		// Check if the brick instance exists
		const instance =
			brick.type !== "collection-fields"
				? data.collection.brickInstances.find(
						(b) => b.key === brick.key,
					)
				: data.collection;
		if (!instance) {
			throw new HeadlessAPIError({
				type: "basic",
				name: T("error_saving_bricks"),
				message: T(
					"error_saving_page_brick_couldnt_find_brick_config",
					{
						key: brick.key || "",
					},
				),
				status: 400,
			});
		}

		const flatFields = brick.fields || [];

		// For fields, validate them against the instance
		for (let j = 0; j < flatFields.length; j++) {
			const field = flatFields[j];

			if (field === undefined) continue;

			// Set the secondary value
			let referenceData: ValidationProps["referenceData"] = undefined;

			switch (field.type) {
				case "link": {
					const value = field.value as LinkValue | undefined;
					referenceData = {
						target: value?.target,
						label: value?.label,
					} satisfies LinkReferenceData;
					break;
				}
				case "pagelink": {
					const value = field.value as PageLinkValue | undefined;
					const document = data.documents.find(
						(p) => p.id === value?.id,
					);
					if (document) {
						referenceData = {
							target: value?.target,
							label: value?.label,
						} satisfies LinkReferenceData;
					} else if (field.value) {
						field.value.id = null;
					}
					break;
				}
				case "media": {
					const media = data.media.find((m) => m.id === field.value);
					if (media) {
						referenceData = {
							extension: media.file_extension,
							width: media.width,
							height: media.height,
							type: media.type,
						} satisfies MediaReferenceData;
					} else if (field.value) {
						field.value = null;
					}
					break;
				}
			}

			const err = instance.fieldValidation({
				key: field.key,
				value: field.value,
				type: field.type,
				referenceData,
				flatFieldConfig: instance.flatFields,
			});

			if (err.valid === false) {
				errors.push({
					key: field.key,
					brickId: brick.id,
					languageId: field.languageId,
					groupId: field.groupId,
					message: err.message || T("invalid_value"),
				});
				hasErrors = true;
			}
		}
	}

	return { errors, hasErrors };
};

const allFieldIdsOfType = <T>(
	fields: z.infer<typeof FieldSchema>[],
	type: FieldTypes,
) => {
	return fields
		.filter((field) => field.type === type)
		.map((field) => {
			if (field.type === "pagelink") {
				return field.value?.id;
			}
			return field.value as T;
		})
		.filter((value) => value !== undefined)
		.filter((value, index, self) => self.indexOf(value) === index);
};

const getAllMedia = async (
	serviceConfig: ServiceConfig,
	fields: z.infer<typeof FieldSchema>[],
) => {
	try {
		const ids = allFieldIdsOfType<number>(fields, "media");
		if (ids.length === 0) return [];

		const MediaRepo = Repository.get("media", serviceConfig.db);

		return MediaRepo.selectMultiple({
			select: ["id", "file_extension", "width", "height", "type"],
			where: [
				{
					key: "id",
					operator: "in",
					value: ids,
				},
			],
		});
	} catch (err) {
		return [];
	}
};
const getAllDocuments = async (
	serviceConfig: ServiceConfig,
	fields: z.infer<typeof FieldSchema>[],
) => {
	try {
		const ids = allFieldIdsOfType<number>(fields, "pagelink");
		if (ids.length === 0) return [];

		const CollectionDocumentsRepo = Repository.get(
			"collection-documents",
			serviceConfig.db,
		);

		return await CollectionDocumentsRepo.selectMultiple({
			select: ["id"],
			where: [
				{
					key: "id",
					operator: "in",
					value: ids,
				},
			],
		});
	} catch (err) {
		return [];
	}
};

export default validateBricks;