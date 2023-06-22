import z from "zod";

const CollectionOptionsSchema = z.object({
  config: z.object({
    type: z.enum(["pages", "group"]),
    title: z.string(),
    singular: z.string(),
    description: z.string().optional(),
    bricks: z.array(z.string()),
  }),
});

// ------------------------------------
// Types & Interfaces
interface CollectionOptions {
  config: {
    type: "pages" | "group";
    title: string;
    singular: string;
    description: string | undefined;
    bricks: Array<{
      key: string;
      type: "builder" | "fixed";
      position?: "standard" | "bottom" | "top" | "sidebar";
    }>;
  };
}

type CollectionBuilderT = InstanceType<typeof CollectionBuilder>;

// ------------------------------------
// BrickBuilder
const CollectionBuilder = class CollectionBuilder {
  key: string;
  config: CollectionOptions["config"];
  constructor(key: string, options: CollectionOptions) {
    this.key = key;
    this.config = options.config;

    this.#validateOptions(options);
    this.#removeDuplicateBricks();
  }
  // ------------------------------------
  // Methods
  #removeDuplicateBricks = () => {
    const bricks = this.config.bricks;

    const builderBricks = bricks.filter((brick) => brick.type === "builder");
    const fixedBricks = bricks.filter((brick) => brick.type === "fixed");

    // Remove duplicate builder bricks
    const uniqueBuilderBricks = builderBricks.filter(
      (brick, index) =>
        builderBricks.findIndex((b) => b.key === brick.key) === index
    );

    // Remove duplicate fixed bricks
    const uniqueFixedBricks = fixedBricks.filter(
      (brick, index) =>
        fixedBricks.findIndex(
          (b) => b.key === brick.key && b.position === brick.position
        ) === index
    );
    this.config.bricks = [...uniqueBuilderBricks, ...uniqueFixedBricks];
  };

  // ------------------------------------
  // Getters

  // ------------------------------------
  // External Methods

  // ------------------------------------
  // Private Methods
  #validateOptions = (options: CollectionOptions) => {
    try {
      CollectionOptionsSchema.parse(options);
    } catch (err) {
      console.error(err);
      throw new Error("Invalid Collection Config");
    }
  };
};

export { CollectionBuilderT };
export default CollectionBuilder;
