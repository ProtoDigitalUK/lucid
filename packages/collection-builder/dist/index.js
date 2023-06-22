"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _CollectionBuilder_removeDuplicateBricks, _CollectionBuilder_addBrickDefaults, _CollectionBuilder_validateOptions, _a;
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const CollectionOptionsSchema = zod_1.default.object({
    config: zod_1.default.object({
        type: zod_1.default.enum(["pages", "group"]),
        title: zod_1.default.string(),
        singular: zod_1.default.string(),
        description: zod_1.default.string().optional(),
        bricks: zod_1.default.array(zod_1.default.object({
            key: zod_1.default.string(),
            type: zod_1.default.enum(["builder", "fixed"]),
            position: zod_1.default.enum(["standard", "bottom", "top", "sidebar"]).optional(),
        })),
    }),
});
// ------------------------------------
// BrickBuilder
const CollectionBuilder = (_a = class CollectionBuilder {
        constructor(key, options) {
            // ------------------------------------
            // Methods
            _CollectionBuilder_removeDuplicateBricks.set(this, () => {
                const bricks = this.config.bricks;
                const builderBricks = bricks.filter((brick) => brick.type === "builder");
                const fixedBricks = bricks.filter((brick) => brick.type === "fixed");
                // Remove duplicate builder bricks
                const uniqueBuilderBricks = builderBricks.filter((brick, index) => builderBricks.findIndex((b) => b.key === brick.key) === index);
                // Remove duplicate fixed bricks
                const uniqueFixedBricks = fixedBricks.filter((brick, index) => fixedBricks.findIndex((b) => b.key === brick.key && b.position === brick.position) === index);
                this.config.bricks = [...uniqueBuilderBricks, ...uniqueFixedBricks];
            });
            _CollectionBuilder_addBrickDefaults.set(this, () => {
                // add default position to fixed bricks
                this.config.bricks = this.config.bricks.map((brick) => {
                    if (brick.type === "fixed" && !brick.position) {
                        brick.position = "standard";
                    }
                    return brick;
                });
            });
            // ------------------------------------
            // Getters
            // ------------------------------------
            // External Methods
            // ------------------------------------
            // Private Methods
            _CollectionBuilder_validateOptions.set(this, (options) => {
                try {
                    CollectionOptionsSchema.parse(options);
                }
                catch (err) {
                    console.error(err);
                    throw new Error("Invalid Collection Config");
                }
            });
            this.key = key;
            this.config = options.config;
            __classPrivateFieldGet(this, _CollectionBuilder_validateOptions, "f").call(this, options);
            __classPrivateFieldGet(this, _CollectionBuilder_removeDuplicateBricks, "f").call(this);
            __classPrivateFieldGet(this, _CollectionBuilder_addBrickDefaults, "f").call(this);
        }
    },
    _CollectionBuilder_removeDuplicateBricks = new WeakMap(),
    _CollectionBuilder_addBrickDefaults = new WeakMap(),
    _CollectionBuilder_validateOptions = new WeakMap(),
    _a);
exports.default = CollectionBuilder;
