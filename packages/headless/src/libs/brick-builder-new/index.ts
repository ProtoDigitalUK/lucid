import z from "zod";
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
} from "./index.d.js";

export default class BrickBuilder {
	key: string;
	fields: CustomFieldT[] = [];
	config: BrickConfigT = {};
	targetRepeater: string[] = [];
	constructor(key: string, config?: BrickConfigT) {
		this.key = key;
		this.config = config || {};

		if (!this.config.title) this.config.title = this.#keyToTitle(key);
	}
	// Custom Fields
	public addFields(BrickBuilder: BrickBuilder) {
		const fields = BrickBuilder.fields;
		for (const field of fields) {
			this.fields.push(field);
		}
		return this;
	}
	public endRepeater() {
		this.targetRepeater = this.targetRepeater.slice(0, -1);
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
		this.#addToFields("repeater", config);
		this.targetRepeater?.push(config.key);
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
		// Fields are currently normalised. Need to nest fields within tabs and repeaters
		const result: Array<CustomFieldT> = [];

		return result;
	}
	// Private
	#addToFields(type: FieldTypesT, config: CustomFieldConfigsT) {
		let repeaterKey: string | undefined = undefined;
		if (this.targetRepeater.length > 0) {
			repeaterKey = this.targetRepeater[this.targetRepeater.length - 1];
		}
		if (type === "tab") repeaterKey = undefined;

		this.fields.push({
			type,
			repeaterKey: repeaterKey,
			title: config.title || this.#keyToTitle(config.key),
			...config,
		});
	}
	#keyToTitle(key: string) {
		if (typeof key !== "string") return key;

		const title = key
			.split(/[-_]/g)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");

		return title;
	}
}
export type BrickBuilderT = InstanceType<typeof BrickBuilder>;

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
