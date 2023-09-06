import z from "zod";
const CollectionOptionsSchema = z.object({
    type: z.enum(["pages", "singlepage"]),
    title: z.string(),
    singular: z.string(),
    description: z.string().optional(),
    bricks: z.array(z.object({
        key: z.string(),
        type: z.enum(["builder", "fixed"]),
        position: z.enum(["standard", "bottom", "top", "sidebar"]).optional(),
    })),
});
export default class CollectionBuilder {
    key;
    config;
    constructor(key, options) {
        this.key = key;
        this.config = options;
        this.#validateOptions(options);
        this.#removeDuplicateBricks();
        this.#addBrickDefaults();
    }
    #removeDuplicateBricks = () => {
        const bricks = this.config.bricks;
        const builderBricks = bricks.filter((brick) => brick.type === "builder");
        const fixedBricks = bricks.filter((brick) => brick.type === "fixed");
        const uniqueBuilderBricks = builderBricks.filter((brick, index) => builderBricks.findIndex((b) => b.key === brick.key) === index);
        const uniqueFixedBricks = fixedBricks.filter((brick, index) => fixedBricks.findIndex((b) => b.key === brick.key && b.position === brick.position) === index);
        this.config.bricks = [...uniqueBuilderBricks, ...uniqueFixedBricks];
    };
    #addBrickDefaults = () => {
        this.config.bricks = this.config.bricks.map((brick) => {
            if (brick.type === "fixed" && !brick.position) {
                brick.position = "standard";
            }
            return brick;
        });
    };
    #validateOptions = (options) => {
        try {
            CollectionOptionsSchema.parse(options);
        }
        catch (err) {
            console.error(err);
            throw new Error("Invalid Collection Config");
        }
    };
}
//# sourceMappingURL=index.js.map