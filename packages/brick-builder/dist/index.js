"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _BrickBuilder_instances, _BrickBuilder_keyToTitle, _BrickBuilder_addToFields, _BrickBuilder_checkKeyDuplication, _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldTypesEnum = void 0;
const zod_1 = __importDefault(require("zod"));
var FieldTypesEnum;
(function (FieldTypesEnum) {
    FieldTypesEnum["Tab"] = "tab";
    FieldTypesEnum["Text"] = "text";
    FieldTypesEnum["Wysiwyg"] = "wysiwyg";
    FieldTypesEnum["Image"] = "image";
    FieldTypesEnum["File"] = "file";
    FieldTypesEnum["Repeater"] = "repeater";
    FieldTypesEnum["Number"] = "number";
    FieldTypesEnum["Checkbox"] = "checkbox";
    FieldTypesEnum["Select"] = "select";
    FieldTypesEnum["Textarea"] = "textarea";
    FieldTypesEnum["JSON"] = "json";
})(FieldTypesEnum || (exports.FieldTypesEnum = FieldTypesEnum = {}));
const baseCustomFieldSchema = zod_1.default.object({
    type: zod_1.default.string(),
    key: zod_1.default.string(),
    title: zod_1.default.string(),
    description: zod_1.default.string().optional(),
    placeholder: zod_1.default.string().optional(),
    options: zod_1.default
        .array(zod_1.default.object({
        label: zod_1.default.string(),
        value: zod_1.default.string(),
    }))
        .optional(),
    validation: zod_1.default
        .object({
        zod: zod_1.default.any().optional(),
        required: zod_1.default.boolean().optional(),
        min: zod_1.default.number().optional(),
        max: zod_1.default.number().optional(),
        extensions: zod_1.default.array(zod_1.default.string()).optional(),
        width: zod_1.default
            .object({
            min: zod_1.default.number().optional(),
            max: zod_1.default.number().optional(),
        })
            .optional(),
        height: zod_1.default
            .object({
            min: zod_1.default.number().optional(),
            max: zod_1.default.number().optional(),
        })
            .optional(),
    })
        .optional(),
});
const customFieldSchemaObject = baseCustomFieldSchema.extend({
    fields: zod_1.default.lazy(() => customFieldSchemaObject.array().optional()),
});
// ------------------------------------
// BrickBuilder
const BrickBuilder = (_a = class BrickBuilder {
        constructor(key, config) {
            _BrickBuilder_instances.add(this);
            this.fields = new Map();
            this.repeaterStack = [];
            this.maxRepeaterDepth = 5;
            this.addText = (config) => {
                __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_checkKeyDuplication).call(this, config.key);
                __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_addToFields).call(this, "text", config);
                return this;
            };
            this.key = key;
            this.title = __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_keyToTitle).call(this, key);
        }
        // ------------------------------------
        // Methods
        addFields(BrickBuilder) {
            const fields = BrickBuilder.fields;
            fields.forEach((field) => {
                __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_checkKeyDuplication).call(this, field.key);
                this.fields.set(field.key, field);
            });
            return this;
        }
        endRepeater() {
            // pop the last added repeater from the stack
            const key = this.repeaterStack.pop();
            if (!key) {
                throw new Error("No open repeater to end.");
            }
            const fields = Array.from(this.fields.values());
            let selectedRepeaterIndex = 0;
            let repeaterKey = "";
            // find the selected repeater
            for (let i = 0; i < fields.length; i++) {
                if (fields[i].type === "repeater" && fields[i].key === key) {
                    selectedRepeaterIndex = i;
                    repeaterKey = fields[i].key;
                    break;
                }
            }
            if (!repeaterKey) {
                throw new Error(`Repeater with key "${key}" does not exist.`);
            }
            const fieldsAfterSelectedRepeater = fields.slice(selectedRepeaterIndex + 1);
            const repeater = this.fields.get(repeaterKey);
            if (repeater) {
                // filter out tab fields
                repeater.fields = fieldsAfterSelectedRepeater.filter((field) => field.type !== "tab");
                fieldsAfterSelectedRepeater.map((field) => {
                    this.fields.delete(field.key);
                });
            }
            return this;
        }
        // ------------------------------------
        // Custom Fields
        addTab(config) {
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_checkKeyDuplication).call(this, config.key);
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_addToFields).call(this, "tab", config);
            return this;
        }
        addWysiwyg(config) {
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_checkKeyDuplication).call(this, config.key);
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_addToFields).call(this, "wysiwyg", config);
            return this;
        }
        addImage(config) {
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_checkKeyDuplication).call(this, config.key);
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_addToFields).call(this, "image", config);
            return this;
        }
        addRepeater(config) {
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_checkKeyDuplication).call(this, config.key);
            // check the current depth of nested repeaters
            if (this.repeaterStack.length >= this.maxRepeaterDepth) {
                throw new Error(`Maximum repeater depth of ${this.maxRepeaterDepth} exceeded.`);
            }
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_addToFields).call(this, "repeater", config);
            // whenever a new repeater is added, push it to the repeater stack
            this.repeaterStack.push(config.key);
            return this;
        }
        addNumber(config) {
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_checkKeyDuplication).call(this, config.key);
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_addToFields).call(this, "number", config);
            return this;
        }
        addCheckbox(config) {
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_checkKeyDuplication).call(this, config.key);
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_addToFields).call(this, "checkbox", config);
            return this;
        }
        addSelect(config) {
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_checkKeyDuplication).call(this, config.key);
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_addToFields).call(this, "select", config);
            return this;
        }
        addTextarea(config) {
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_checkKeyDuplication).call(this, config.key);
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_addToFields).call(this, "textarea", config);
            return this;
        }
        addJSON(config) {
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_checkKeyDuplication).call(this, config.key);
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_addToFields).call(this, "json", config);
            return this;
        }
        // ------------------------------------
        // Getters
        get fieldTree() {
            // everything between two tabs should get removed and added to the tab fields array
            const fields = Array.from(this.fields.values());
            let result = [];
            let currentTab = null;
            fields.forEach((item) => {
                if (item.type === "tab") {
                    if (currentTab) {
                        result.push(currentTab);
                    }
                    currentTab = { ...item, fields: [] };
                }
                else if (currentTab) {
                    if (!currentTab.fields)
                        currentTab.fields = [];
                    currentTab.fields.push(item);
                }
                else {
                    result.push(item);
                }
            });
            if (currentTab) {
                result.push(currentTab);
            }
            return result;
        }
        get flatFields() {
            const fields = [];
            const fieldArray = Array.from(this.fields.values());
            const getFields = (field) => {
                fields.push(field);
                if (field.type === "repeater") {
                    field.fields?.forEach((item) => {
                        getFields(item);
                    });
                }
            };
            fieldArray.forEach((field) => {
                getFields(field);
            });
            return fields;
        }
        // ------------------------------------
        // Field Type Validation
        validateTextType({ type, key, value, }) {
            const field = this.flatFields.find((item) => item.key === key);
            if (!field) {
                return {
                    valid: false,
                    message: `Field with key "${key}" does not exist.`,
                };
            }
            // Check if field type is text
            const typeValidation = this.validateType(type, field.type);
            if (!typeValidation.valid) {
                return typeValidation;
            }
            // Check if value is a string
            if (typeof value !== "string") {
                return {
                    valid: false,
                    message: "Value must be a string.",
                };
            }
            // Check if field is required
            if (field.validation?.required) {
                const requiredValidation = this.validateRequired(value);
                if (!requiredValidation.valid) {
                    return requiredValidation;
                }
            }
            // run zod validation
            if (field.validation?.zod) {
                const zodValidation = this.validateZodSchema(field.validation.zod, value);
                if (!zodValidation.valid) {
                    return zodValidation;
                }
            }
            return {
                valid: true,
            };
        }
        // ------------------------------------
        // Validation Util
        validateRequired(value) {
            if (value === undefined || value === null || value === "") {
                return {
                    valid: false,
                    message: "This field is required.",
                };
            }
            return {
                valid: true,
            };
        }
        validateType(providedType, type) {
            if (providedType !== type) {
                return {
                    valid: false,
                    message: `Field type must be "${type}".`,
                };
            }
            return {
                valid: true,
            };
        }
        validateZodSchema(schema, value) {
            try {
                schema.parse(value);
                return {
                    valid: true,
                };
            }
            catch (error) {
                const err = error;
                return {
                    valid: false,
                    message: err.issues[0].message,
                };
            }
        }
    },
    _BrickBuilder_instances = new WeakSet(),
    _BrickBuilder_keyToTitle = function _BrickBuilder_keyToTitle(key) {
        if (typeof key !== "string")
            return key;
        const title = key
            .split(/[-_]/g) // split on hyphen or underscore
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each word
            .join(" "); // rejoin words with space
        return title;
    },
    _BrickBuilder_addToFields = function _BrickBuilder_addToFields(type, config) {
        const noUndefinedConfig = Object.keys(config).reduce((acc, key) => {
            // @ts-ignore
            if (config[key] !== undefined) {
                // @ts-ignore
                acc[key] = config[key];
            }
            return acc;
        }, {});
        const data = {
            type: type,
            title: config.title || __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_keyToTitle).call(this, config.key),
            ...noUndefinedConfig,
        };
        const validation = baseCustomFieldSchema.safeParse(data);
        if (!validation.success) {
            throw new Error(validation.error.message);
        }
        this.fields.set(config.key, data);
    },
    _BrickBuilder_checkKeyDuplication = function _BrickBuilder_checkKeyDuplication(key) {
        if (this.fields.has(key)) {
            throw new Error(`Field with key "${key}" already exists.`);
        }
    },
    _a);
const bannerBrick = new BrickBuilder("banner")
    .addTab({
    key: "content_tab",
})
    .addText({
    key: "title",
    description: "The title of the banner",
    validation: {
        zod: zod_1.default.string().min(3).max(10),
    },
})
    .addWysiwyg({
    key: "description",
})
    .addRepeater({
    key: "links",
    validation: {
        max: 3,
    },
})
    .addText({
    key: "image_alt",
    validation: {
        zod: zod_1.default.string().min(3).max(10),
    },
})
    .addImage({
    key: "image",
})
    .endRepeater()
    .addWysiwyg({
    key: "description_last",
})
    .addTab({
    key: "general-2",
})
    .addText({
    key: "title-2",
    description: "The title of the banner",
});
exports.default = BrickBuilder;
