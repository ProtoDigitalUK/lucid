import z from "zod";
import sanitizeHtml from "sanitize-html";
// Types
import {
	BrickConfigOptionsT,
	CustomField,
	FieldTypes,
	TabConfig,
	TextConfig,
	RepeaterConfig,
	WysiwygConfig,
	MediaConfig,
	NumberConfig,
	CheckboxConfig,
	SelectConfig,
	CustomFieldConfig,
	TextareaConfig,
	JSONConfig,
	ColourConfig,
	DateTimeConfig,
	PageLinkConfig,
	LinkConfig,
	ValidationResponse,
	FieldConfigs,
	ValidationProps,
	MediaReferenceData,
	LinkReferenceData,
	defaultFieldValues,
} from "./types.js";

// ------------------------------------
// Schema
const baseCustomFieldSchema = z.object({
	type: z.string(),
	key: z.string(),
	title: z.string(),
	description: z.string().optional(),
	placeholder: z.string().optional(),
	// boolean or string
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
export type Fields = z.infer<typeof baseCustomFieldSchema> & {
	fields?: Fields[];
};
const customFieldSchemaObject: z.ZodType<Fields> = baseCustomFieldSchema.extend(
	{
		fields: z.lazy(() => customFieldSchemaObject.array().optional()),
	},
);

// ------------------------------------
// Validation
class ValidationError extends Error {
	constructor(public message: string) {
		super(message);
		this.name = "ValidationError";
	}
}

// ------------------------------------
// BrickBuilder
export default class BrickBuilder {
	key: string;
	title: string;
	fields: Map<string, CustomField> = new Map();
	repeaterStack: string[] = [];
	maxRepeaterDepth = 3;
	config: BrickConfigOptionsT = {};
	constructor(key: string, config?: BrickConfigOptionsT) {
		this.key = key;
		this.title = this.#keyToTitle(key);
		this.config = config || {};
	}
	// ------------------------------------
	public addFields(BrickBuilder: BrickBuilder) {
		const fields = Array.from(BrickBuilder.fields.values());
		for (const field of fields) {
			this.#checkKeyDuplication(field.key);
			this.fields.set(field.key, field);
		}
		return this;
	}
	public endRepeater() {
		// pop the last added repeater from the stack
		const key = this.repeaterStack.pop();

		if (!key) {
			throw new Error("No open repeater to end.");
		}

		const fields = Array.from(this.fields.values());
		let selectedRepeaterIndex = 0;
		let repeaterKey = "";

		// find the selected repeater
		for (let i = 0; i < fields.length; i++) {
			if (fields[i].type === "repeater" && fields[i].key === key) {
				selectedRepeaterIndex = i;
				repeaterKey = fields[i].key;
				break;
			}
		}

		if (!repeaterKey) {
			throw new Error(`Repeater with key "${key}" does not exist.`);
		}

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
	// ------------------------------------
	// Custom Fields
	public addTab(config: TabConfig) {
		this.#checkKeyDuplication(config.key);
		this.#addToFields("tab", config);
		return this;
	}
	public addText = (config: TextConfig) => {
		this.#checkKeyDuplication(config.key);
		this.#addToFields("text", config);
		return this;
	};
	public addWysiwyg(config: WysiwygConfig) {
		this.#checkKeyDuplication(config.key);
		this.#addToFields("wysiwyg", config);
		return this;
	}
	public addMedia(config: MediaConfig) {
		this.#checkKeyDuplication(config.key);
		this.#addToFields("media", config);
		return this;
	}
	public addRepeater(config: RepeaterConfig) {
		this.#checkKeyDuplication(config.key);
		// check the current depth of nested repeaters
		if (this.repeaterStack.length >= this.maxRepeaterDepth) {
			throw new Error(
				`Maximum repeater depth of ${this.maxRepeaterDepth} exceeded.`,
			);
		}
		this.#addToFields("repeater", config);
		// whenever a new repeater is added, push it to the repeater stack
		this.repeaterStack.push(config.key);
		return this;
	}
	public addNumber(config: NumberConfig) {
		this.#checkKeyDuplication(config.key);
		this.#addToFields("number", config);
		return this;
	}
	public addCheckbox(config: CheckboxConfig) {
		this.#checkKeyDuplication(config.key);
		this.#addToFields("checkbox", config);
		return this;
	}
	public addSelect(config: SelectConfig) {
		this.#checkKeyDuplication(config.key);
		this.#addToFields("select", config);
		return this;
	}
	public addTextarea(config: TextareaConfig) {
		this.#checkKeyDuplication(config.key);
		this.#addToFields("textarea", config);
		return this;
	}
	public addJSON(config: JSONConfig) {
		this.#checkKeyDuplication(config.key);
		this.#addToFields("json", config);
		return this;
	}
	public addColour(config: ColourConfig) {
		this.#checkKeyDuplication(config.key);
		this.#addToFields("colour", config);
		return this;
	}
	public addDateTime(config: DateTimeConfig) {
		this.#checkKeyDuplication(config.key);
		this.#addToFields("datetime", config);
		return this;
	}
	public addPageLink(config: PageLinkConfig) {
		this.#checkKeyDuplication(config.key);
		this.#addToFields("pagelink", config);
		return this;
	}
	public addLink(config: LinkConfig) {
		this.#checkKeyDuplication(config.key);
		this.#addToFields("link", config);
		return this;
	}
	// ------------------------------------
	// Getters
	get fieldTree() {
		// everything between two tabs should get removed and added to the tab fields array
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
	get basicFieldTree() {
		const fieldArray = Array.from(this.fields.values());
		// return fields minus tab
		for (const field of fieldArray) {
			if (field.type === "tab") {
				fieldArray.splice(fieldArray.indexOf(field), 1);
			}
		}
		return fieldArray;
	}
	get flatFields() {
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
	// ------------------------------------
	// Field Type Validation
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
		pagelink: {
			type: "object",
			nullable: false,
		},
		checkbox: {
			type: "boolean",
			nullable: false,
		},
	};
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
				throw new ValidationError(
					`Field with key "${key}" does not exist.`,
				);
			}

			// Check if field type matches
			if (field.type !== type) {
				throw new ValidationError(
					`Field with key "${key}" is not a ${type}.`,
				);
			}

			// Check if field is required
			if (field.validation?.required) {
				if (value === undefined || value === null || value === "") {
					let message = "Please enter a value.";
					if (field.type === "checkbox")
						message = "Please ensure the switch is checked.";
					if (field.type === "select")
						message = "Please ensure an option is selected.";
					throw new ValidationError(message);
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
						throw new ValidationError(
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
					if (value === null) {
						throw new ValidationError(
							"Please ensure the media exists.",
						);
					}
					this.#validateMediaType(
						field,
						referenceData as MediaReferenceData,
						value as number | null,
					);
					break;
				}
				case "datetime": {
					if (!value) break;
					const date = new Date(value as string);
					if (Number.isNaN(date.getTime())) {
						throw new ValidationError(
							"Please ensure the date is valid.",
						);
					}
					break;
				}
				case "link": {
					this.#validateLinkTarget(
						referenceData as LinkReferenceData,
					);
					break;
				}
				case "pagelink": {
					const id = (value as { id: number | null }).id;
					if (id === null) {
						throw new ValidationError(
							"Please ensure the page exists.",
						);
					}
					this.#validateLinkTarget(
						referenceData as LinkReferenceData,
					);
					break;
				}
			}
		} catch (error) {
			// Catch validation errors and return them
			if (error instanceof ValidationError) {
				return {
					valid: false,
					message: error.message,
				};
			}
			throw error;
		}

		return {
			valid: true,
		};
	}
	// ------------------------------------
	#validateSelectType(field: CustomField, value: string) {
		if (field.validation?.required !== true && !value) return;
		if (field.options) {
			const optionValues = field.options.map((option) => option.value);
			if (!optionValues.includes(value)) {
				throw new ValidationError(
					"Please ensure an option is selected.",
				);
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
	#validateMediaType(
		field: CustomField,
		referenceData: MediaReferenceData,
		value: number | null = null,
	) {
		if (field.validation?.required !== true && !value) return;

		if (referenceData === undefined) {
			throw new ValidationError(
				"We couldn't find the media you selected.",
			);
		}

		// Check if value is in the options
		if (field.validation?.extensions?.length) {
			const extension = referenceData.extension;
			if (!field.validation.extensions.includes(extension)) {
				throw new ValidationError(
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
				throw new ValidationError("This media does not have a type.");
			}

			if (field.validation.type !== type) {
				throw new ValidationError(
					`Media must be of type "${field.validation.type}".`,
				);
			}
		}

		// Check width
		if (field.validation?.width) {
			const width = referenceData.width;
			if (!width) {
				throw new ValidationError("This media does not have a width.");
			}

			if (
				field.validation.width.min &&
				width < field.validation.width.min
			) {
				throw new ValidationError(
					`Media width must be greater than ${field.validation.width.min}px.`,
				);
			}
			if (
				field.validation.width.max &&
				width > field.validation.width.max
			) {
				throw new ValidationError(
					`Media width must be less than ${field.validation.width.max}px.`,
				);
			}
		}

		// Check height
		if (field.validation?.height) {
			const height = referenceData.height;
			if (!height) {
				throw new ValidationError("This media does not have a height.");
			}

			if (
				field.validation.height.min &&
				height < field.validation.height.min
			) {
				throw new ValidationError(
					`Media height must be greater than ${field.validation.height.min}px.`,
				);
			}
			if (
				field.validation.height.max &&
				height > field.validation.height.max
			) {
				throw new ValidationError(
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
			throw new ValidationError(
				`Please set the target to one of the following: ${allowedValues.join(
					", ",
				)}.`,
			);
		}
	}
	// ------------------------------------
	// Validation Util
	#validateZodSchema(schema: z.ZodSchema<unknown>, value: unknown) {
		try {
			schema.parse(value);
		} catch (error) {
			const err = error as z.ZodError;
			throw new ValidationError(err.issues[0].message);
		}
	}
	// ------------------------------------
	// Private Methods
	#keyToTitle(key: string) {
		if (typeof key !== "string") return key;

		const title = key
			.split(/[-_]/g) // split on hyphen or underscore
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each word
			.join(" "); // rejoin words with space

		return title;
	}
	#addToFields(type: FieldTypes, config: FieldConfigs) {
		const noUndefinedConfig = Object.keys(config).reduce((acc, key) => {
			// @ts-ignore
			if (config[key] !== undefined) {
				// @ts-ignore
				acc[key] = config[key];
			}
			return acc;
		}, {});

		const data = {
			type: type,
			title: config.title || this.#keyToTitle(config.key),
			...(noUndefinedConfig as CustomFieldConfig),
			default: this.#setFieldDefaults(type, config),
		};

		const validation = baseCustomFieldSchema.safeParse(data);
		if (!validation.success) {
			throw new Error(validation.error.message);
		}

		this.fields.set(config.key, data);
	}
	#setFieldDefaults(
		type: FieldTypes,
		config: FieldConfigs,
	): defaultFieldValues {
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
			case "pagelink": {
				return undefined;
			}
			case "link": {
				return undefined;
			}
		}
	}
	#checkKeyDuplication(key: string) {
		if (this.fields.has(key)) {
			throw new Error(`Field with key "${key}" already exists.`);
		}
	}
}

export type BrickBuilderT = InstanceType<typeof BrickBuilder>;
export * from "./types.js";
