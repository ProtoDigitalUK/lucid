import T from "../../../translations/index.js";
import {
	APIError,
	modelErrors,
	type FieldErrorsT,
} from "../../../utils/app/error-handler.js";
import getConfig from "../../config.js";
import collectionsServices from "../../collections/index.js";
import BrickBuilder, {
	type ValidationProps,
	type MediaReferenceData,
	type LinkReferenceData,
	type FieldTypes,
} from "../../../builders/brick-builder/index.js";
import type { PageLinkValueT, LinkValueT } from "@headless/types/src/bricks.js";
import type { CollectionResT } from "@headless/types/src/collections.js";
import type {
	BrickObjectT,
	BrickFieldObjectT,
} from "../../../schemas/bricks.js";
import { type CollectionConfigT } from "../../../builders/collection-builder/index.js";

export interface ServiceData {
	type: CollectionConfigT["type"];
	bricks: Array<BrickObjectT>;
	collection_key: string;
}

const validateBricks = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const config = await getConfig();

	const flatFields =
		data.bricks.flatMap((brick) => {
			return brick.fields || [];
		}) || [];

	const [collection, media, pages] = await Promise.all([
		collectionsServices.getSingle({
			key: data.collection_key,
			type: data.type,
		}),
		getAllMedia(serviceConfig, flatFields),
		getAllPages(serviceConfig, flatFields),
	]);

	// validate bricks
	const { errors, hasErrors } = await validateBrickData({
		bricks: data.bricks,
		builderInstances: config.bricks || [],
		collection: collection,
		media: media,
		pages: pages,
	});

	// If there are errors, throw them
	if (hasErrors) {
		throw new APIError({
			type: "basic",
			name: T("error_saving_bricks"),
			message: T("there_was_an_error_updating_bricks"),
			status: 400,
			errors: modelErrors({
				fields: errors,
			}),
		});
	}
};

const validateBrickData = async (data: {
	bricks: BrickObjectT[];
	builderInstances: BrickBuilder[];
	collection: CollectionResT;
	media: Array<{
		id: number;
		file_extension: string;
		width: number | null;
		height: number | null;
		type: string;
	}>;
	pages: {
		id: number;
	}[];
}) => {
	const errors: FieldErrorsT[] = [];
	let hasErrors = false;

	for (let i = 0; i < data.bricks.length; i++) {
		const brick = data.bricks[i];

		// Check if the brick instance exists
		const instance = data.builderInstances.find((b) => b.key === brick.key);
		if (!instance) {
			throw new APIError({
				type: "basic",
				name: T("error_saving_bricks"),
				message: T(
					"error_saving_page_brick_couldnt_find_brick_config",
					{
						key: brick.key,
					},
				),
				status: 400,
			});
		}

		// Check if the brick is permitted against the collection
		const allowedInCollection = data.collection.bricks?.find(
			(b) => b.key === brick.key && b.type === brick.type,
		);
		if (allowedInCollection === undefined) {
			throw new APIError({
				type: "basic",
				name: T("error_saving_bricks"),
				message: T("error_saving_page_brick_not_in_collection", {
					key: brick.key,
					type: brick.type,
				}),
				status: 400,
			});
		}

		const flatFields = brick.fields || [];

		// For fields, validate them against the instance
		for (let j = 0; j < flatFields.length; j++) {
			const field = flatFields[j];

			// Set the secondary value
			let referenceData: ValidationProps["referenceData"] = undefined;

			switch (field.type) {
				case "link": {
					const value = field.value as LinkValueT | undefined;
					referenceData = {
						target: value?.target,
						label: value?.label,
					} satisfies LinkReferenceData;
					break;
				}
				case "pagelink": {
					const value = field.value as PageLinkValueT | undefined;
					const page = data.pages.find((p) => p.id === value?.id);
					if (page) {
						referenceData = {
							target: value?.target,
							label: value?.label,
						} satisfies LinkReferenceData;
					} else {
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
					} else {
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
					brick_id: brick.id,
					language_id: field.language_id,
					group_id: field.group_id,
					message: err.message || T("invalid_value"),
				});
				hasErrors = true;
			}
		}
	}

	return { errors, hasErrors };
};

const allFieldIdsOfType = <T>(
	fields: BrickFieldObjectT[],
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
	serviceConfig: ServiceConfigT,
	fields: BrickFieldObjectT[],
) => {
	try {
		const ids = allFieldIdsOfType<number>(fields, "media");
		if (ids.length === 0) return [];
		return await serviceConfig.db
			.selectFrom("headless_media")
			.select(["id", "file_extension", "width", "height", "type"])
			.where("id", "in", allFieldIdsOfType<number>(fields, "media"))
			.execute();
	} catch (err) {
		return [];
	}
};
const getAllPages = async (
	serviceConfig: ServiceConfigT,
	fields: BrickFieldObjectT[],
) => {
	try {
		const ids = allFieldIdsOfType<number>(fields, "pagelink");
		if (ids.length === 0) return [];
		return await serviceConfig.db
			.selectFrom("headless_collection_multiple_builder")
			.select("id")
			.where("id", "in", ids)
			.execute();
	} catch (err) {
		return [];
	}
};

export default validateBricks;
