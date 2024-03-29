import z from "zod";
import sanitizeHtml from "sanitize-html";
import type {
	CustomFieldT,
	FieldTypesT,
	CheckboxConfigT,
	ColourConfigT,
	DateTimeConfigT,
	JSONConfigT,
	LinkConfigT,
	MediaConfigT,
	NumberConfigT,
	PageLinkConfigT,
	SelectConfigT,
	TextConfigT,
	TextareaConfigT,
	WysiwygConfigT,
	CustomFieldConfigsT,
	DefaultFieldValuesT,
	FieldBuilderMetaT,
	ValidationPropsT,
	MediaReferenceDataT,
	LinkReferenceDataT,
	ValidationResponseT,
} from "./types.js";

class FieldBuilder {
	fields: Map<string, CustomFieldT> = new Map();
	meta: FieldBuilderMetaT = {
		fieldKeys: [],
		repeaterDepth: {},
	};
	// Custom Fields
	public addText(config: TextConfigT) {
		this.addToFields("text", config);
		return this;
	}
	public addWysiwyg(config: WysiwygConfigT) {
		this.addToFields("wysiwyg", config);
		return this;
	}
	public addMedia(config: MediaConfigT) {
		this.addToFields("media", config);
		return this;
	}
	public addNumber(config: NumberConfigT) {
		this.addToFields("number", config);
		return this;
	}
	public addCheckbox(config: CheckboxConfigT) {
		this.addToFields("checkbox", config);
		return this;
	}
	public addSelect(config: SelectConfigT) {
		this.addToFields("select", config);
		return this;
	}
	public addTextarea(config: TextareaConfigT) {
		this.addToFields("textarea", config);
		return this;
	}
	public addJSON(config: JSONConfigT) {
		this.addToFields("json", config);
		return this;
	}
	public addColour(config: ColourConfigT) {
		this.addToFields("colour", config);
		return this;
	}
	public addDateTime(config: DateTimeConfigT) {
		this.addToFields("datetime", config);
		return this;
	}
	public addPageLink(config: PageLinkConfigT) {
		this.addToFields("pagelink", config);
		return this;
	}
	public addLink(config: LinkConfigT) {
		this.addToFields("link", config);
		return this;
	}
	// Getters
	get fieldTree(): CustomFieldT[] {
		const fields = Array.from(this.fields.values());

		const result: Array<CustomFieldT> = [];
		let currentTab: CustomFieldT | null = null;

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
	get flatFields(): CustomFieldT[] {
		const fields: CustomFieldT[] = [];

		const fieldArray = Array.from(this.fields.values());
		const getFields = (field: CustomFieldT) => {
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
	//
	protected addToFields(type: FieldTypesT, config: CustomFieldConfigsT) {
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
		type: FieldTypesT,
		config: CustomFieldConfigsT,
	): DefaultFieldValuesT {
		switch (type) {
			case "tab": {
				break;
			}
			case "text": {
				return (config as TextConfigT).default || "";
			}
			case "wysiwyg": {
				return (config as WysiwygConfigT).default || "";
			}
			case "media": {
				return undefined;
			}
			case "number": {
				return (config as NumberConfigT).default || null;
			}
			case "checkbox": {
				return (config as CheckboxConfigT).default || false;
			}
			case "select": {
				return (config as SelectConfigT).default || "";
			}
			case "textarea": {
				return (config as TextareaConfigT).default || "";
			}
			case "json": {
				return (config as JSONConfigT).default || {};
			}
			case "colour": {
				return (config as ColourConfigT).default || "";
			}
			case "datetime": {
				return (config as DateTimeConfigT).default || "";
			}
			case "pagelink": {
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
	}: ValidationPropsT): ValidationResponseT {
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
						referenceData as MediaReferenceDataT,
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
						referenceData as LinkReferenceDataT,
					);
					break;
				}
				case "pagelink": {
					this.#validateLinkTarget(
						referenceData as LinkReferenceDataT,
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
	#validateSelectType(field: CustomFieldT, value: string) {
		if (field.validation?.required !== true && !value) return;
		if (field.options) {
			const optionValues = field.options.map((option) => option.value);
			if (!optionValues.includes(value)) {
				throw new Error("Please ensure an option is selected.");
			}
		}
	}
	#validateWysiwygType(field: CustomFieldT, value: string) {
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
		field: CustomFieldT,
		referenceData: MediaReferenceDataT,
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
	#validateLinkTarget(referenceData: LinkReferenceDataT) {
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
			throw new Error(err.issues[0].message);
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
		pagelink: {
			type: "object",
			nullable: false,
		},
		checkbox: {
			type: "boolean",
			nullable: false,
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

export type FieldBuilderT = InstanceType<typeof FieldBuilder>;
export * from "./types.js";
export default FieldBuilder;
