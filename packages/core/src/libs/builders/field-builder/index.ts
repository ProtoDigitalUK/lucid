import T from "../../../translations/index.js";
import z from "zod";
import sanitizeHtml from "sanitize-html";
import type {
	CustomField,
	FieldTypes,
	CheckboxConfig,
	ColourConfig,
	DateTimeConfig,
	JSONConfig,
	LinkConfig,
	UserConfig,
	MediaConfig,
	NumberConfig,
	SelectConfig,
	TextConfig,
	TextareaConfig,
	WysiwygConfig,
	RepeaterConfig,
	CustomFieldConfigs,
	DefaultFieldValues,
	FieldBuilderMeta,
	ValidationProps,
	MediaReferenceData,
	UserReferenceData,
	LinkReferenceData,
	ValidationResponse,
} from "./types.js";

class FieldBuilder {
	fields: Map<string, CustomField> = new Map();
	repeaterStack: string[] = [];
	meta: FieldBuilderMeta = {
		fieldKeys: [],
		repeaterDepth: {},
	};
	// Custom Fields
	public endRepeater() {
		const key = this.repeaterStack.pop();
		if (!key) return this;

		const fields = Array.from(this.fields.values());
		let selectedRepeaterIndex = 0;
		let repeaterKey = "";

		// find the selected repeater
		for (let i = 0; i < fields.length; i++) {
			const field = fields[i];
			if (!field) continue;
			if (field.type === "repeater" && field.key === key) {
				selectedRepeaterIndex = i;
				repeaterKey = field.key;
				break;
			}
		}

		if (!repeaterKey) return this;

		const fieldsAfterSelectedRepeater = fields.slice(
			selectedRepeaterIndex + 1,
		);
		const repeater = this.fields.get(repeaterKey);
		if (repeater) {
			// filter out tab fields
			repeater.fields = fieldsAfterSelectedRepeater.filter(
				(field) => field.type !== "tab",
			);
			fieldsAfterSelectedRepeater.map((field) => {
				this.fields.delete(field.key);
			});
		}

		return this;
	}
	public addRepeater(config: RepeaterConfig) {
		this.meta.repeaterDepth[config.key] = this.repeaterStack.length;

		this.addToFields("repeater", config);
		this.repeaterStack.push(config.key);
		return this;
	}
	public addText(config: TextConfig) {
		this.addToFields("text", config);
		return this;
	}
	public addWysiwyg(config: WysiwygConfig) {
		this.addToFields("wysiwyg", config);
		return this;
	}
	public addMedia(config: MediaConfig) {
		this.addToFields("media", config);
		return this;
	}
	public addNumber(config: NumberConfig) {
		this.addToFields("number", config);
		return this;
	}
	public addCheckbox(config: CheckboxConfig) {
		this.addToFields("checkbox", config);
		return this;
	}
	public addSelect(config: SelectConfig) {
		this.addToFields("select", config);
		return this;
	}
	public addTextarea(config: TextareaConfig) {
		this.addToFields("textarea", config);
		return this;
	}
	public addJSON(config: JSONConfig) {
		this.addToFields("json", config);
		return this;
	}
	public addColour(config: ColourConfig) {
		this.addToFields("colour", config);
		return this;
	}
	public addDateTime(config: DateTimeConfig) {
		this.addToFields("datetime", config);
		return this;
	}
	public addLink(config: LinkConfig) {
		this.addToFields("link", config);
		return this;
	}
	public addUser(config: UserConfig) {
		this.addToFields("user", config);
		return this;
	}
	// Getters
	get fieldTree(): CustomField[] {
		const fields = Array.from(this.fields.values());

		const result: Array<CustomField> = [];
		let currentTab: CustomField | null = null;

		for (const item of fields) {
			if (item.type === "tab") {
				if (currentTab) {
					result.push(currentTab);
				}
				currentTab = { ...item, fields: [] };
			} else if (currentTab) {
				if (!currentTab.fields) currentTab.fields = [];
				currentTab.fields.push(item);
			} else {
				result.push(item);
			}
		}

		if (currentTab) {
			result.push(currentTab);
		}

		return result;
	}
	get flatFields(): CustomField[] {
		const fields: CustomField[] = [];

		const fieldArray = Array.from(this.fields.values());
		const getFields = (field: CustomField) => {
			fields.push(field);
			if (field.type === "repeater") {
				for (const item of field.fields || []) {
					getFields(item);
				}
			}
		};

		for (const field of fieldArray) {
			getFields(field);
		}

		return fields;
	}
	get fieldTreeNoTab() {
		const fieldArray = Array.from(this.fields.values());
		for (const field of fieldArray) {
			if (field.type === "tab") {
				fieldArray.splice(fieldArray.indexOf(field), 1);
			}
		}
		return fieldArray;
	}
	//
	protected addToFields(type: FieldTypes, config: CustomFieldConfigs) {
		this.meta.fieldKeys.push(config.key);
		this.fields.set(config.key, {
			...config,
			type: type,
			title: config.title || this.keyToTitle(config.key),
			default: this.#fieldDefaults(type, config),
		});
	}
	protected keyToTitle(key: string) {
		if (typeof key !== "string") return key;

		const title = key
			.split(/[-_]/g)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");

		return title;
	}
	#fieldDefaults(
		type: FieldTypes,
		config: CustomFieldConfigs,
	): DefaultFieldValues {
		switch (type) {
			case "tab": {
				break;
			}
			case "text": {
				return (config as TextConfig).default || "";
			}
			case "wysiwyg": {
				return (config as WysiwygConfig).default || "";
			}
			case "media": {
				return undefined;
			}
			case "number": {
				return (config as NumberConfig).default || null;
			}
			case "checkbox": {
				return (config as CheckboxConfig).default || false;
			}
			case "select": {
				return (config as SelectConfig).default || "";
			}
			case "textarea": {
				return (config as TextareaConfig).default || "";
			}
			case "json": {
				return (config as JSONConfig).default || {};
			}
			case "colour": {
				return (config as ColourConfig).default || "";
			}
			case "datetime": {
				return (config as DateTimeConfig).default || "";
			}
			case "user": {
				return undefined;
			}
			case "link": {
				return undefined;
			}
		}
	}
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
				if (dataType.nullable && value !== null) {
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

export const FieldsSchema = z.object({
	type: z.string(),
	key: z.string(),
	title: z.string(),
	description: z.string().optional(),
	placeholder: z.string().optional(),
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
