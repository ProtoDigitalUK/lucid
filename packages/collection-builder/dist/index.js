"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _CollectionBuilder_validateOptions, _a;
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const CollectionOptionsSchema = zod_1.default.object({
    config: zod_1.default.object({
        type: zod_1.default.enum(["pages", "group"]),
        title: zod_1.default.string(),
        singular: zod_1.default.string(),
        description: zod_1.default.string().optional(),
        bricks: zod_1.default.array(zod_1.default.string()),
    }),
});
// ------------------------------------
// BrickBuilder
const CollectionBuilder = (_a = class CollectionBuilder {
        constructor(key, options) {
            // ------------------------------------
            // Methods
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
        }
    },
    _CollectionBuilder_validateOptions = new WeakMap(),
    _a);
exports.default = CollectionBuilder;
