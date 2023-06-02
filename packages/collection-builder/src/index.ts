import z from "zod";

const CollectionOptionsSchema = z.object({
  config: z.object({
    type: z.enum(["single", "multiple"]),
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
    type: "single" | "multiple";
    title: string;
    singular: string;
    description: string | undefined;
    bricks: string[];
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
  }
  // ------------------------------------
  // Methods

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
