import T from "../../../translations/index.js";
import z from "zod";
import sanitizeHtml from "sanitize-html";

import type CustomFieldConfig from "../../custom-fields/cf-config.js";
import CheckboxCF from "../../custom-fields/fields/checkbox.js";
import ColourCF from "../../custom-fields/fields/colour.js";
import DateTimeCF from "../../custom-fields/fields/datetime.js";
import JSONCF from "../../custom-fields/fields/json.js";
import LinkCF from "../../custom-fields/fields/link.js";
import MediaCF from "../../custom-fields/fields/media.js";
import NumberCF from "../../custom-fields/fields/number.js";
import RepeaterCF from "../../custom-fields/fields/repeater.js";
import SelectCF from "../../custom-fields/fields/select.js";
import TextCF from "../../custom-fields/fields/text.js";
import TextareaCF from "../../custom-fields/fields/textarea.js";
import UserCF from "../../custom-fields/fields/user.js";
import WysiwygCF from "../../custom-fields/fields/wysiwyg.js";
import type {
	FieldTypes,
	CFProps,
	CFConfig,
	TabFieldConfig,
} from "../../custom-fields/types.js";

// TODO: most if not all can be removed
import type {
	CustomField,
	FieldBuilderMeta,
	ValidationProps,
	MediaReferenceData,
	UserReferenceData,
	LinkReferenceData,
	ValidationResponse,
} from "./types.js";

class FieldBuilder {
	fields: Map<string, CustomFieldConfig<FieldTypes>> = new Map();
	repeaterStack: string[] = [];
	meta: FieldBuilderMeta = {
		fieldKeys: [],
		repeaterDepth: {},
	};
	// Custom Fields
	public addRepeater(key: string, props?: CFProps<"repeater">) {
		this.meta.repeaterDepth[key] = this.repeaterStack.length;
		this.fields.set(key, new RepeaterCF.Config(key, props));
		this.repeaterStack.push(key);
		return this;
	}
	public addText(key: string, props?: CFProps<"text">) {
		this.fields.set(key, new TextCF.Config(key, props));
		this.meta.fieldKeys.push(key);
		return this;
	}
	public addWysiwyg(key: string, props?: CFProps<"wysiwyg">) {
		this.fields.set(key, new WysiwygCF.Config(key, props));
		this.meta.fieldKeys.push(key);
		return this;
	}
	public addMedia(key: string, props?: CFProps<"media">) {
		this.fields.set(key, new MediaCF.Config(key, props));
		this.meta.fieldKeys.push(key);
		return this;
	}
	public addNumber(key: string, props?: CFProps<"number">) {
		this.fields.set(key, new NumberCF.Config(key, props));
		this.meta.fieldKeys.push(key);
		return this;
	}
	public addCheckbox(key: string, props?: CFProps<"checkbox">) {
		this.fields.set(key, new CheckboxCF.Config(key, props));
		this.meta.fieldKeys.push(key);
		return this;
	}
	public addSelect(key: string, props?: CFProps<"select">) {
		this.fields.set(key, new SelectCF.Config(key, props));
		this.meta.fieldKeys.push(key);
		return this;
	}
	public addTextarea(key: string, props?: CFProps<"textarea">) {
		this.fields.set(key, new TextareaCF.Config(key, props));
		this.meta.fieldKeys.push(key);
		return this;
	}
	public addJSON(key: string, props?: CFProps<"json">) {
		this.fields.set(key, new JSONCF.Config(key, props));
		this.meta.fieldKeys.push(key);
		return this;
	}
	public addColour(key: string, props?: CFProps<"colour">) {
		this.fields.set(key, new ColourCF.Config(key, props));
		this.meta.fieldKeys.push(key);
		return this;
	}
	public addDateTime(key: string, props?: CFProps<"datetime">) {
		this.fields.set(key, new DateTimeCF.Config(key, props));
		this.meta.fieldKeys.push(key);
		return this;
	}
	public addLink(key: string, props?: CFProps<"link">) {
		this.fields.set(key, new LinkCF.Config(key, props));
		this.meta.fieldKeys.push(key);
		return this;
	}
	public addUser(key: string, props?: CFProps<"user">) {
		this.fields.set(key, new UserCF.Config(key, props));
		this.meta.fieldKeys.push(key);
		return this;
	}
	public endRepeater() {
		const key = this.repeaterStack.pop();
		if (!key) return this;

		// Get all fields as an array
		const fields = Array.from(this.fields.values());

		// Find the index of the repeater that is being closed
		const selectedRepeaterIndex = fields.findIndex(
			(field) => field.type === "repeater" && field.key === key,
		);
		if (selectedRepeaterIndex === -1) return this; // Repeater not found

		// Track only fields after this repeater
		const fieldsAfter = fields.slice(selectedRepeaterIndex + 1);

		// Update fields in the current nesting level
		for (const field of fieldsAfter) {
			if (field.type === "tab" || field.repeater) {
				// If the field is under a tab or already has a repeater, do not modify
				continue;
			}
			field.repeater = key;
		}

		return this;
	}
	// Private Methods
	private nestFields(excludeTabs: boolean): CFConfig<FieldTypes>[] {
		const fields = Array.from(this.fields.values()).filter((field) => {
			if (excludeTabs) {
				return field.type !== "tab";
			}
			return true;
		});

		const result: CFConfig<FieldTypes>[] = [];
		let currentTab: CFConfig<"tab"> | null = null;
		const repeaterStack: Map<string, CFConfig<"repeater">> = new Map();

		for (const field of fields) {
			const config = field.config;

			if (field.type === "tab") {
				if (currentTab) result.push(currentTab);
				currentTab = field.config as CFConfig<"tab">;
				continue;
			}

			// add repeater to the stack
			if (field.type === "repeater")
				repeaterStack.set(field.key, config as CFConfig<"repeater">);

			const targetPush = currentTab ? currentTab.fields : result;

			if (field.repeater) {
				const repeater = repeaterStack.get(field.repeater);
				if (repeater)
					repeater.fields.push(
						config as Exclude<CFConfig<FieldTypes>, TabFieldConfig>,
					);
			} else {
				targetPush.push(config);
			}
		}

		if (currentTab) result.push(currentTab);

		return result;
	}
	// Getters
	get fieldTree(): CFConfig<FieldTypes>[] {
		return this.nestFields(false);
	}
	get fieldTreeNoTab(): Exclude<CFConfig<FieldTypes>, TabFieldConfig>[] {
		return this.nestFields(true) as Exclude<
			CFConfig<FieldTypes>,
			TabFieldConfig
		>[];
	}
	get flatFields(): CFConfig<FieldTypes>[] {
		const config: CFConfig<FieldTypes>[] = [];
		for (const [_, value] of this.fields) {
			config.push(value.config);
		}
		return config;
	}

	// TODO: move bellow in cf-config class and individual custom field classes
	// -----------------------------------------
	// Validation
	// ------------------------------------
	fieldValidation({
		type,
		key,
		value,
		referenceData,
		flatFieldConfig,
	}: ValidationProps): ValidationResponse {
		try {
			// Check if field exists in config
			const field = flatFieldConfig.find((item) => item.key === key);
			if (!field) {
				throw new Error(`Field with key "${key}" does not exist.`);
			}

			// Check if field type matches
			if (field.type !== type) {
				throw new Error(`Field with key "${key}" is not a ${type}.`);
			}

			// Check if field is required
			if (field.validation?.required) {
				if (value === undefined || value === null || value === "") {
					let message = "Please enter a value.";
					if (field.type === "checkbox")
						message = "Please ensure the switch is checked.";
					if (field.type === "select")
						message = "Please ensure an option is selected.";
					throw new Error(message);
				}
			}

			// run zod validation
			if (field.validation?.zod && field.type !== "wysiwyg") {
				this.#validateZodSchema(field.validation.zod, value);
			}

			// Use the map to do the data type validation
			const dataType = this.fieldTypeToDataType[field.type];
			if (dataType) {
				if (
					dataType.nullable &&
					value !== null &&
					value !== undefined
				) {
					// biome-ignore lint/suspicious/useValidTypeof: <explanation>
					if (typeof value !== dataType.type) {
						throw new Error(
							`The field value must be a ${dataType}.`,
						);
					}
				}
			}

			// Field specific validation
			switch (field.type) {
				case "select": {
					this.#validateSelectType(field, value as string);
					break;
				}
				case "wysiwyg": {
					this.#validateWysiwygType(field, value as string);
					break;
				}
				case "media": {
					this.#validateMediaType(
						field,
						referenceData as MediaReferenceData,
						value as number | null,
					);
					break;
				}
				case "user": {
					this.#validateUserType(
						field,
						referenceData as UserReferenceData,
						value as number | null,
					);
					break;
				}
				case "datetime": {
					if (!value) break;
					const date = new Date(value as string);
					if (Number.isNaN(date.getTime())) {
						throw new Error("Please ensure the date is valid.");
					}
					break;
				}
				case "link": {
					this.#validateLinkTarget(
						referenceData as LinkReferenceData,
					);
					break;
				}
			}

			return {
				valid: true,
			};
		} catch (err) {
			const error = err as Error;
			return {
				valid: false,
				message: error?.message || "An unknown error occurred.",
			};
		}
	}
	#validateSelectType(field: CustomField, value: string) {
		if (field.validation?.required !== true && !value) return;
		if (field.options) {
			const optionValues = field.options.map((option) => option.value);
			if (!optionValues.includes(value)) {
				throw new Error("Please ensure an option is selected.");
			}
		}
	}
	#validateWysiwygType(field: CustomField, value: string) {
		const sanitizedValue = sanitizeHtml(value, {
			allowedTags: [],
			allowedAttributes: {},
		});

		// run zod validation
		if (field.validation?.zod) {
			this.#validateZodSchema(field.validation.zod, sanitizedValue);
		}
	}
	#validateUserType(
		field: CustomField,
		referenceData: UserReferenceData,
		value: number | null,
	) {
		if (field.validation?.required !== true && !value) return;

		if (referenceData === undefined) {
			throw new Error("We couldn't find the user you selected.");
		}
	}
	#validateMediaType(
		field: CustomField,
		referenceData: MediaReferenceData,
		value: number | null = null,
	) {
		if (field.validation?.required !== true && !value) return;

		if (referenceData === undefined) {
			throw new Error("We couldn't find the media you selected.");
		}

		// Check if value is in the options
		if (field.validation?.extensions?.length) {
			const extension = referenceData.extension;
			if (!field.validation.extensions.includes(extension)) {
				throw new Error(
					`Media must be one of the following extensions: ${field.validation.extensions.join(
						", ",
					)}`,
				);
			}
		}

		// Check type
		if (field.validation?.type) {
			const type = referenceData.type;
			if (!type) {
				throw new Error("This media does not have a type.");
			}

			if (field.validation.type !== type) {
				throw new Error(
					`Media must be of type "${field.validation.type}".`,
				);
			}
		}

		// Check width
		if (field.validation?.width) {
			const width = referenceData.width;
			if (!width) {
				throw new Error("This media does not have a width.");
			}

			if (
				field.validation.width.min &&
				width < field.validation.width.min
			) {
				throw new Error(
					`Media width must be greater than ${field.validation.width.min}px.`,
				);
			}
			if (
				field.validation.width.max &&
				width > field.validation.width.max
			) {
				throw new Error(
					`Media width must be less than ${field.validation.width.max}px.`,
				);
			}
		}

		// Check height
		if (field.validation?.height) {
			const height = referenceData.height;
			if (!height) {
				throw new Error("This media does not have a height.");
			}

			if (
				field.validation.height.min &&
				height < field.validation.height.min
			) {
				throw new Error(
					`Media height must be greater than ${field.validation.height.min}px.`,
				);
			}
			if (
				field.validation.height.max &&
				height > field.validation.height.max
			) {
				throw new Error(
					`Media height must be less than ${field.validation.height.max}px.`,
				);
			}
		}
	}
	#validateLinkTarget(referenceData: LinkReferenceData) {
		if (!referenceData) return;

		const allowedValues = ["_self", "_blank"];
		if (!referenceData.target) return;
		if (!allowedValues.includes(referenceData.target)) {
			throw new Error(
				`Please set the target to one of the following: ${allowedValues.join(
					", ",
				)}.`,
			);
		}
	}
	#validateZodSchema(schema: z.ZodSchema<unknown>, value: unknown) {
		try {
			schema.parse(value);
		} catch (error) {
			const err = error as z.ZodError;
			const firstIssue = err.issues[0];
			if (firstIssue?.message) {
				throw new Error(firstIssue.message);
			}
			throw new Error(T("an_unknown_error_occurred"));
		}
	}
	private fieldTypeToDataType: Record<
		string,
		{
			type: "string" | "number" | "boolean" | "object";
			nullable: boolean;
		}
	> = {
		text: {
			type: "string",
			nullable: true,
		},
		textarea: {
			type: "string",
			nullable: true,
		},
		colour: {
			type: "string",
			nullable: true,
		},
		datetime: {
			type: "string",
			nullable: true,
		},
		link: {
			type: "object",
			nullable: false,
		},
		wysiwyg: {
			type: "string",
			nullable: true,
		},
		select: {
			type: "string",
			nullable: true,
		},
		number: {
			type: "number",
			nullable: true,
		},
		checkbox: {
			type: "boolean",
			nullable: false,
		},
		media: {
			type: "number",
			nullable: true,
		},
		user: {
			type: "number",
			nullable: true,
		},
	};
}

// TODO: move to cf-config class
export const FieldsSchema = z.object({
	type: z.string(),
	key: z.string(),
	labels: z
		.object({
			title: z.string().optional(),
			description: z.string().optional(),
			placeholder: z.string().optional(),
		})
		.optional(),
	default: z
		.union([
			z.boolean(),
			z.string(),
			z.number(),
			z.undefined(),
			z.object({}),
			z.null(),
		])
		.optional(),
	options: z
		.array(
			z.object({
				label: z.string(),
				value: z.string(),
			}),
		)
		.optional(),
	presets: z
		.array(
			z.object({
				label: z.string(),
				value: z.string(),
			}),
		)
		.optional(),
	validation: z
		.object({
			zod: z.any().optional(),
			required: z.boolean().optional(),
			extensions: z.array(z.string()).optional(),
			width: z
				.object({
					min: z.number().optional(),
					max: z.number().optional(),
				})
				.optional(),
			height: z
				.object({
					min: z.number().optional(),
					max: z.number().optional(),
				})
				.optional(),
		})
		.optional(),
});

export * from "./types.js";
export default FieldBuilder;
