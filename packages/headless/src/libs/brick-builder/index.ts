import z from "zod";
import FieldBuilder from "../field-builder/index.js";

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
	constructor(key: string, config?: BrickConfigPropsT) {
		super();
		this.key = key;
		this.config = {
			title: config?.title || super.keyToTitle(key),
			preview: config?.preview || {},
		};
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

export type BrickBuilderT = InstanceType<typeof BrickBuilder>;
export default BrickBuilder;
