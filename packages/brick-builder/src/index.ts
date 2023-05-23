// ------------------------------------
// Types & Interfaces
interface BricConfig {}

interface BrickFields {}

// custom fields
interface CustomField {
  key: string;
  title?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  validate?: (value: string) => boolean;
  validateMessage?: string;
}

// text field
interface TextConfig extends CustomField {
  pattern?: string;
}
interface WysiwygConfig extends CustomField {}
interface ImageConfig extends CustomField {}

// ------------------------------------
// BrickBuilder
const BrickBuilder = class BrickBuilder {
  key: string;
  title: string;
  fields: Array<BrickFields> = [];
  constructor(key: string, config?: BricConfig) {
    this.key = key;
    this.title = this.#keyToTitle(key);
  }
  // ------------------------------------
  // Public Methods
  public addText = (config: TextConfig) => {
    console.log("addText", this.#keyToTitle(config.key));
    return this;
  };
  public addWysiwyg(config: WysiwygConfig) {
    console.log("addWysiwyg", this.#keyToTitle(config.key));
    return this;
  }
  public addImage(config: ImageConfig) {
    console.log("addImage", this.#keyToTitle(config.key));
    return this;
  }
  // ------------------------------------
  // Private Methods
  #keyToTitle(key: string) {
    return key.replace(/-/g, " ").replace(/\w\S*/g, (w) => {
      return w.replace(/^\w/, (c) => c.toUpperCase());
    });
  }
};

new BrickBuilder("banner")
  .addText({
    key: "title",
  })
  .addWysiwyg({
    key: "description",
  })
  .addImage({
    key: "image",
  });

export default BrickBuilder;
