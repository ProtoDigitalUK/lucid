import z from "zod";
import FieldBuilder from "../field-builder/index.js";
import type { TabConfig } from "../field-builder/index.js";

export interface BrickConfigPropsT {
	title?: string;
	description?: string;
	preview?: {
		image?: string;
	};
}
export interface BrickConfigT {
	title: string;
	description?: string;
	preview?: {
		image?: string;
	};
}

class BrickBuilder extends FieldBuilder {
	key: string;
	config: BrickConfigT;
	constructor(key: string, config?: BrickConfigPropsT) {
		super();
		this.key = key;
		this.config = {
			title: config?.title || super.keyToTitle(key),
			description: config?.description,
			preview: config?.preview || {},
		};
	}
	// Builder methods
	public addFields(Builder: BrickBuilder) {
		const fields = Array.from(Builder.fields.values());
		for (const field of fields) {
			this.fields.set(field.key, field);
			this.meta.fieldKeys.push(field.key);
		}
		return this;
	}
	public addTab(config: TabConfig) {
		this.addToFields("tab", config);
		return this;
	}
}

export const BrickSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	preview: z
		.object({
			image: z.string().optional(),
		})
		.optional(),
});

export default BrickBuilder;
