import T from "../../../translations/index.js";
import { LucidAPIError } from "../../../utils/error-handler.js";
import type { FieldErrors } from "../../../types/errors.js";
import type {
	FieldTypes,
	MediaReferenceData,
	LinkReferenceData,
	UserReferenceData,
} from "../../../libs/custom-fields/types.js";
import type { FieldInsertItem } from "../helpers/flatten-fields.js";
import type { LinkValue } from "../../../types/response.js";
import type BrickBuilder from "../../../libs/builders/brick-builder/index.js";
import type CollectionBuilder from "../../../libs/builders/collection-builder/index.js";
import type { ServiceConfig } from "../../../utils/service-wrapper.js";
import type { BrickInsertItem } from "../helpers/format-insert-bricks.js";
import Repository from "../../../libs/repositories/index.js";

export interface ServiceData {
	bricks: Array<BrickInsertItem>;
	collection: CollectionBuilder;
}

const checkValidateBricksFields = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const flatFields =
		data.bricks.flatMap((brick) => {
			return brick.fields || [];
		}) || [];

	const [media, users] = await Promise.all([
		getAllMedia(serviceConfig, flatFields),
		getAllUsers(serviceConfig, flatFields),
	]);

	const errors: FieldErrors[] = [];
	for (let i = 0; i < data.bricks.length; i++) {
		const b = data.bricks[i];
		if (!b) continue;
		errors.push(
			...validateBrick({
				brick: b,
				collection: data.collection,
				media: media,
				users: users,
			}),
		);
	}

	if (errors.length) {
		throw new LucidAPIError({
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

const validateBrick = (props: {
	brick: BrickInsertItem;
	collection: CollectionBuilder;
	media: Awaited<ReturnType<typeof getAllMedia>>;
	users: Awaited<ReturnType<typeof getAllUsers>>;
}): FieldErrors[] => {
	const errors: FieldErrors[] = [];

	const instance =
		props.brick.type === "collection-fields"
			? props.collection
			: props.collection.brickInstances.find(
					(b) => b.key === props.brick.key,
				);

	if (!instance) {
		throw new LucidAPIError({
			type: "basic",
			name: T("error_saving_bricks"),
			message: T("error_saving_page_brick_couldnt_find_brick_config", {
				key: props.brick.key || "",
			}),
			status: 400,
		});
	}

	const fields = props.brick.fields || [];

	for (let i = 0; i < fields.length; i++) {
		const field = fields[i];
		if (field === undefined) continue;

		const fieldRes = validateField({
			field: field,
			brickId: props.brick.id,
			instance: instance,
			media: props.media,
			users: props.users,
		});
		if (fieldRes === null) continue;
		errors.push(fieldRes);
	}

	return errors;
};
const validateField = (props: {
	field: FieldInsertItem;
	brickId?: number;
	instance: CollectionBuilder | BrickBuilder;
	media: Awaited<ReturnType<typeof getAllMedia>>;
	users: Awaited<ReturnType<typeof getAllUsers>>;
}): FieldErrors | null => {
	const fieldInstance = props.instance.fields.get(props.field.key);
	if (!fieldInstance) {
		return {
			key: props.field.key,
			brickId: props.brickId,
			localeCode: props.field.localeCode,
			groupId: props.field.groupId,
			message: T("cannot_find_field_in_collection_or_brick"),
		};
	}

	let fieldValRes: {
		valid: boolean;
		message?: string;
	} = {
		valid: false,
		message: T("an_unknown_error_occurred_validating_the_field"),
	};

	switch (props.field.type) {
		case "link": {
			const value = props.field.value as LinkValue | undefined;

			fieldValRes = fieldInstance.validate(value, {
				target: value?.target,
				label: value?.label,
			} satisfies LinkReferenceData);
			break;
		}
		case "media": {
			const media = props.media.find((m) => m.id === props.field.value);
			if (media) {
				fieldValRes = fieldInstance.validate(props.field.value, {
					extension: media.file_extension,
					width: media.width,
					height: media.height,
					type: media.type,
				} satisfies MediaReferenceData);
			} else if (props.field.value !== undefined) {
				fieldInstance.validate(null, undefined);
			}

			break;
		}
		case "user": {
			const user = props.users.find((u) => u.id === props.field.value);
			if (user) {
				fieldValRes = fieldInstance.validate(props.field.value, {
					username: user.username,
					email: user.email,
					firstName: user.first_name,
					lastName: user.last_name,
				} satisfies UserReferenceData);
			} else if (props.field.value !== undefined) {
				fieldValRes = fieldInstance.validate(null, undefined);
			}
			break;
		}
		default: {
			fieldValRes = fieldInstance.validate(props.field.value, undefined);
		}
	}

	if (fieldValRes.valid === true) return null;

	return {
		key: props.field.key,
		brickId: props.brickId,
		localeCode: props.field.localeCode,
		groupId: props.field.groupId,
		message:
			fieldValRes.message ||
			T("an_unknown_error_occurred_validating_the_field"),
	};
};

// -----------------------------------------------
// Helpers / Date Fetching
const allFieldIdsOfType = <T>(fields: FieldInsertItem[], type: FieldTypes) => {
	return fields
		.filter((field) => field.type === type)
		.map((field) => {
			return field.value as T;
		})
		.filter((value) => value !== undefined)
		.filter((value, index, self) => self.indexOf(value) === index);
};

const getAllMedia = async (
	serviceConfig: ServiceConfig,
	fields: FieldInsertItem[],
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
const getAllUsers = async (
	serviceConfig: ServiceConfig,
	fields: FieldInsertItem[],
) => {
	try {
		const ids = allFieldIdsOfType<number>(fields, "user");
		if (ids.length === 0) return [];

		const UsersRepo = Repository.get("users", serviceConfig.db);

		return await UsersRepo.selectMultiple({
			select: ["id", "username", "email", "first_name", "last_name"],
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

export default checkValidateBricksFields;
