"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const CollectionOptionsSchema = zod_1.default.object({
    type: zod_1.default.enum(["pages", "singlepage"]),
    title: zod_1.default.string(),
    singular: zod_1.default.string(),
    description: zod_1.default.string().optional(),
    bricks: zod_1.default.array(zod_1.default.object({
        key: zod_1.default.string(),
        type: zod_1.default.enum(["builder", "fixed"]),
        position: zod_1.default.enum(["standard", "bottom", "top", "sidebar"]).optional(),
    })),
});
class CollectionBuilder {
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
exports.default = CollectionBuilder;
//# sourceMappingURL=index.js.map