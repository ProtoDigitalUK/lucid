import T from "../../../translations/index.js";
import lucidLogger from "../../../libs/logging/index.js";
import Repository from "../../../libs/repositories/index.js";
import type { FieldErrors } from "../../../types/errors.js";
import type {
	FieldTypes,
	MediaReferenceData,
	UserReferenceData,
} from "../../../libs/custom-fields/types.js";
import type { FieldInsertItem } from "../helpers/flatten-fields.js";
import type BrickBuilder from "../../../libs/builders/brick-builder/index.js";
import type CollectionBuilder from "../../../libs/builders/collection-builder/index.js";
import type { ServiceConfig, ServiceFn } from "../../../libs/services/types.js";
import type { BrickInsertItem } from "../helpers/format-insert-bricks.js";

const checkValidateBricksFields: ServiceFn<
	[
		{
			bricks: Array<BrickInsertItem>;
			collection: CollectionBuilder;
		},
	],
	undefined
> = async (serviceConfig, data) => {
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
		return {
			error: {
				type: "basic",
				name: T("field_validation_error_name"),
				message: T("field_validation_error_message"),
				status: 400,
				errorResponse: {
					body: {
						fields: errors,
					},
				},
			},
			data: undefined,
		};
	}

	return {
		error: undefined,
		data: undefined,
	};
};

export const validateBrick = (props: {
	brick: BrickInsertItem;
	collection: CollectionBuilder;
	media: Awaited<ReturnType<typeof getAllMedia>>;
	users: Awaited<ReturnType<typeof getAllUsers>>;
}): FieldErrors[] => {
	const errors: FieldErrors[] = [];

	let instance = undefined;

	switch (props.brick.type) {
		case "collection-fields": {
			instance = props.collection;
			break;
		}
		case "builder": {
			instance = props.collection.config.bricks?.builder?.find(
				(b) => b.key === props.brick.key,
			);
			break;
		}
		case "fixed": {
			instance = props.collection.config.bricks?.fixed?.find(
				(b) => b.key === props.brick.key,
			);
			break;
		}
	}

	if (!instance) {
		lucidLogger("error", {
			message: T("error_saving_page_brick_couldnt_find_brick_config", {
				key: props.brick.key || "",
			}),
		});
		return errors;
	}

	for (let i = 0; i < props.brick.fields.length; i++) {
		const field = props.brick.fields[i];
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
export const validateField = (props: {
	field: FieldInsertItem;
	brickId: number | string;
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
		case "media": {
			const media = props.media.find((m) => m.id === props.field.value);
			if (media) {
				fieldValRes = fieldInstance.validate({
					type: props.field.type,
					value: props.field.value,
					relationData: {
						extension: media.file_extension,
						width: media.width,
						height: media.height,
						type: media.type,
					} satisfies MediaReferenceData,
				});
			} else if (props.field.value !== undefined) {
				// if the media doesnt exist, we treat the value as null
				fieldValRes = fieldInstance.validate({
					type: props.field.type,
					value: null,
					relationData: undefined,
				});
			} else {
				fieldValRes = fieldInstance.validate({
					type: props.field.type,
					value: undefined,
					relationData: undefined,
				});
			}
			break;
		}
		case "user": {
			const user = props.users.find((u) => u.id === props.field.value);
			if (user) {
				fieldValRes = fieldInstance.validate({
					type: props.field.type,
					value: props.field.value,
					relationData: {
						username: user.username,
						email: user.email,
						firstName: user.first_name,
						lastName: user.last_name,
					} satisfies UserReferenceData,
				});
			} else if (props.field.value !== undefined) {
				// if the user doesnt exist, we treat the value as null
				fieldValRes = fieldInstance.validate({
					type: props.field.type,
					value: null,
					relationData: undefined,
				});
			} else {
				fieldValRes = fieldInstance.validate({
					type: props.field.type,
					value: undefined,
					relationData: undefined,
				});
			}
			break;
		}
		default: {
			fieldValRes = fieldInstance.validate({
				type: props.field.type,
				value: props.field.value,
				relationData: undefined,
			});
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
