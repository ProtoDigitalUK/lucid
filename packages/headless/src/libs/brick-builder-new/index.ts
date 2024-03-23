import z, { string } from "zod";
import constants from "../../constants.js";
import type {
	CustomFieldT,
	FieldTypesT,
	BrickConfigT,
	CheckboxConfigT,
	ColourConfigT,
	DateTimeConfigT,
	JSONConfigT,
	LinkConfigT,
	MediaConfigT,
	NumberConfigT,
	PageLinkConfigT,
	RepeaterConfigT,
	SelectConfigT,
	TabConfigT,
	TextConfigT,
	TextareaConfigT,
	WysiwygConfigT,
	CustomFieldConfigsT,
	DefaultFieldValuesT,
	BrickBuilderMetaT,
} from "./types.js";

class BrickBuilder {
	key: string;
	fields: Map<string, CustomFieldT> = new Map();
	config: BrickConfigT = {};
	repeaterStack: string[] = [];
	meta: BrickBuilderMetaT = {
		fieldKeys: [],
		repeaterDepth: {},
	};
	constructor(key: string, config?: BrickConfigT) {
		this.key = key;
		this.config = config || {};

		if (!this.config.title) this.config.title = this.#keyToTitle(key);
	}
	// Custom Fields
	public addFields(BrickBuilder: BrickBuilder) {
		const fields = Array.from(BrickBuilder.fields.values());
		for (const field of fields) {
			this.fields.set(field.key, field);
			this.meta.fieldKeys.push(field.key);
		}
		return this;
	}
	public endRepeater() {
		const key = this.repeaterStack.pop();
		if (!key) return;

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

		if (!repeaterKey) return;

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
	public addTab(config: TabConfigT) {
		this.#addToFields("tab", config);
		return this;
	}
	public addText(config: TextConfigT) {
		this.#addToFields("text", config);
		return this;
	}
	public addWysiwyg(config: WysiwygConfigT) {
		this.#addToFields("wysiwyg", config);
		return this;
	}
	public addMedia(config: MediaConfigT) {
		this.#addToFields("media", config);
		return this;
	}
	public addRepeater(config: RepeaterConfigT) {
		this.meta.repeaterDepth[config.key] = this.repeaterStack.length;

		this.#addToFields("repeater", config);
		this.repeaterStack.push(config.key);
		return this;
	}
	public addNumber(config: NumberConfigT) {
		this.#addToFields("number", config);
		return this;
	}
	public addCheckbox(config: CheckboxConfigT) {
		this.#addToFields("checkbox", config);
		return this;
	}
	public addSelect(config: SelectConfigT) {
		this.#addToFields("select", config);
		return this;
	}
	public addTextarea(config: TextareaConfigT) {
		this.#addToFields("textarea", config);
		return this;
	}
	public addJSON(config: JSONConfigT) {
		this.#addToFields("json", config);
		return this;
	}
	public addColour(config: ColourConfigT) {
		this.#addToFields("colour", config);
		return this;
	}
	public addDateTime(config: DateTimeConfigT) {
		this.#addToFields("datetime", config);
		return this;
	}
	public addPageLink(config: PageLinkConfigT) {
		this.#addToFields("pagelink", config);
		return this;
	}
	public addLink(config: LinkConfigT) {
		this.#addToFields("link", config);
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
	// Private
	#addToFields(type: FieldTypesT, config: CustomFieldConfigsT) {
		this.meta.fieldKeys.push(config.key);
		this.fields.set(config.key, {
			...config,
			type: type,
			title: config.title || this.#keyToTitle(config.key),
			default: this.#fieldDefaults(type, config),
		});
	}
	// Helpers
	#keyToTitle(key: string) {
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
}

export const BrickSchema = z.object({
	title: z.string(),
	preview: z
		.object({
			image: z.string().optional(),
		})
		.optional(),
});

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

export type BrickBuilderT = InstanceType<typeof BrickBuilder>;
export * from "./types.js";
export default BrickBuilder;
