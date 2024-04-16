import z from "zod";
import FieldBuilder from "../field-builder/index.js";
import type { RepeaterConfig, TabConfig } from "../field-builder/index.js";

export interface BrickConfigPropsT {
	title?: string;
	preview?: {
		image?: string;
	};
}
export interface BrickConfigT {
	title: string;
	preview?: {
		image?: string;
	};
}

class BrickBuilder extends FieldBuilder {
	key: string;
	config: BrickConfigT;
	repeaterStack: string[] = [];
	constructor(key: string, config?: BrickConfigPropsT) {
		super();
		this.key = key;
		this.config = {
			title: config?.title || super.keyToTitle(key),
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
	public addTab(config: TabConfig) {
		this.addToFields("tab", config);
		return this;
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

export default BrickBuilder;
