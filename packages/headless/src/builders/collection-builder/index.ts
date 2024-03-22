import z from "zod";

export default class CollectionBuilder {
	key: string;
	config: CollectionConfigT;
	constructor(key: string, options: CollectionConfigT) {
		this.key = key;
		this.config = options;

		this.#validateOptions(options);
		this.#removeDuplicateBricks();
		this.#addBrickDefaults();
	}
	// ------------------------------------
	// Private Methods
	#validateOptions = (options: CollectionConfigT) => {
		try {
			CollectionOptionsSchema.parse(options);
		} catch (err) {
			console.error(err);
			throw new Error("Invalid Collection Config");
		}
	};
	#removeDuplicateBricks = () => {
		if (!this.config.bricks) return;
		const bricks = this.config.bricks;

		const builderBricks = bricks.filter(
			(brick) => brick.type === "builder",
		);
		const fixedBricks = bricks.filter((brick) => brick.type === "fixed");

		// Remove duplicate builder bricks
		const uniqueBuilderBricks = builderBricks.filter(
			(brick, index) =>
				builderBricks.findIndex((b) => b.key === brick.key) === index,
		);

		// Remove duplicate fixed bricks
		const uniqueFixedBricks = fixedBricks.filter(
			(brick, index) =>
				fixedBricks.findIndex(
					(b) => b.key === brick.key && b.position === brick.position,
				) === index,
		);
		this.config.bricks = [...uniqueBuilderBricks, ...uniqueFixedBricks];
	};
	#addBrickDefaults = () => {
		if (!this.config.bricks) return;
		// add default position to fixed bricks
		this.config.bricks = this.config.bricks.map((brick) => {
			if (brick.type === "fixed" && !brick.position) {
				brick.position = "bottom";
			}
			return brick;
		});
	};
}

const CollectionOptionsSchema = z.object({
	type: z.enum(["builder"]),
	multiple: z.boolean().default(false),
	title: z.string(),
	singular: z.string(),
	description: z.string().optional(),
	slug: z.string().optional(),
	disableParents: z.boolean().default(false).optional(),
	disableHomepages: z.boolean().default(false).optional(),
	bricks: z
		.array(
			z.object({
				key: z.string(),
				type: z.enum(["builder", "fixed"]),
				position: z.enum(["bottom", "top", "sidebar"]).optional(),
			}),
		)
		.optional(),
});

export type CollectionConfigT = z.infer<typeof CollectionOptionsSchema>;
export type CollectionBrickConfigT = {
	key: string;
	type: "builder" | "fixed";
	position?: "bottom" | "top" | "sidebar";
};

export type CollectionBuilderT = InstanceType<typeof CollectionBuilder>;
