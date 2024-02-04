import z from "zod";

const CollectionOptionsSchema = z.object({
  type: z.enum(["pages", "singlepage"]),
  title: z.string(),
  singular: z.string(),
  description: z.string().optional(),
  path: z.string().optional(),
  disableHomepage: z.boolean().optional(),
  disableParent: z.boolean().optional(),
  bricks: z.array(
    z.object({
      key: z.string(),
      type: z.enum(["builder", "fixed"]),
      position: z.enum(["bottom", "top", "sidebar"]).optional(),
    })
  ),
});

// ------------------------------------
// Types & Interfaces

export type CollectionConfigT = z.infer<typeof CollectionOptionsSchema>;
export type CollectionBrickConfigT = CollectionConfigT["bricks"][0];

export type CollectionBuilderT = InstanceType<typeof CollectionBuilder>;

// ------------------------------------
// Collection Builder
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
  #addBrickDefaults = () => {
    // add default position to fixed bricks
    this.config.bricks = this.config.bricks.map((brick) => {
      if (brick.type === "fixed" && !brick.position) {
        brick.position = "bottom";
      }
      return brick;
    });
  };

  // ------------------------------------
  // Getters

  // ------------------------------------
  // External Methods

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
}
