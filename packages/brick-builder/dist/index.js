"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _BrickBuilder_instances, _BrickBuilder_validateSelectType, _BrickBuilder_validateWysiwygType, _BrickBuilder_validateImageType, _BrickBuilder_validateFileType, _BrickBuilder_validateDatetimeType, _BrickBuilder_validateLinkTarget, _BrickBuilder_validateRequired, _BrickBuilder_validateType, _BrickBuilder_validateZodSchema, _BrickBuilder_validateIsString, _BrickBuilder_validateIsNumber, _BrickBuilder_validateIsBoolean, _BrickBuilder_keyToTitle, _BrickBuilder_addToFields, _BrickBuilder_checkKeyDuplication, _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldTypesEnum = void 0;
const zod_1 = __importDefault(require("zod"));
const sanitize_html_1 = __importDefault(require("sanitize-html"));
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
    FieldTypesEnum["Colour"] = "colour";
    FieldTypesEnum["Datetime"] = "datetime";
    FieldTypesEnum["Pagelink"] = "pagelink";
    FieldTypesEnum["Link"] = "link";
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
        addFile(config) {
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_checkKeyDuplication).call(this, config.key);
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_addToFields).call(this, "file", config);
            return this;
        }
        addColour(config) {
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_checkKeyDuplication).call(this, config.key);
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_addToFields).call(this, "colour", config);
            return this;
        }
        addDateTime(config) {
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_checkKeyDuplication).call(this, config.key);
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_addToFields).call(this, "datetime", config);
            return this;
        }
        addPageLink(config) {
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_checkKeyDuplication).call(this, config.key);
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_addToFields).call(this, "pagelink", config);
            return this;
        }
        addLink(config) {
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_checkKeyDuplication).call(this, config.key);
            __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_addToFields).call(this, "link", config);
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
        fieldValidation({ type, key, value, secondaryValue, }) {
            const field = this.flatFields.find((item) => item.key === key);
            if (!field) {
                return {
                    valid: false,
                    message: `Field with key "${key}" does not exist.`,
                };
            }
            // Check if field type is text
            const typeValidation = __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_validateType).call(this, type, field.type);
            if (!typeValidation.valid) {
                return typeValidation;
            }
            // Check if field is required
            if (field.validation?.required) {
                const requiredValidation = __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_validateRequired).call(this, value);
                if (!requiredValidation.valid) {
                    return requiredValidation;
                }
            }
            // run zod validation
            if (field.validation?.zod && field.type !== "wysiwyg") {
                const zodValidation = __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_validateZodSchema).call(this, field.validation.zod, value);
                if (!zodValidation.valid) {
                    return zodValidation;
                }
            }
            // Validate string
            if (field.type === "text" ||
                field.type === "textarea" ||
                field.type === "colour" ||
                field.type === "datetime" ||
                field.type === "link" ||
                field.type === "wysiwyg" ||
                field.type === "select") {
                const stringValidation = __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_validateIsString).call(this, value);
                if (!stringValidation.valid) {
                    return stringValidation;
                }
            }
            // Validate number
            if (field.type === "number" || field.type === "pagelink") {
                const numberValidation = __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_validateIsNumber).call(this, value);
                if (!numberValidation.valid) {
                    return numberValidation;
                }
            }
            // Validate boolean
            if (field.type === "checkbox") {
                const checkboxValidation = __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_validateIsBoolean).call(this, value);
                if (!checkboxValidation.valid) {
                    return checkboxValidation;
                }
            }
            // Field specific validation
            switch (field.type) {
                case "select": {
                    const selectTypeValidation = __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_validateSelectType).call(this, field, {
                        type,
                        key,
                        value,
                    });
                    if (!selectTypeValidation.valid) {
                        return selectTypeValidation;
                    }
                    break;
                }
                case "wysiwyg": {
                    const wysiwygTypeValidation = __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_validateWysiwygType).call(this, field, {
                        type,
                        key,
                        value,
                    });
                    if (!wysiwygTypeValidation.valid) {
                        return wysiwygTypeValidation;
                    }
                    break;
                }
                case "image": {
                    const imageTypeValidation = __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_validateImageType).call(this, field, {
                        type,
                        key,
                        value,
                    });
                    if (!imageTypeValidation.valid) {
                        return imageTypeValidation;
                    }
                    break;
                }
                case "file": {
                    const fileTypeValidation = __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_validateFileType).call(this, field, {
                        type,
                        key,
                        value,
                    });
                    if (!fileTypeValidation.valid) {
                        return fileTypeValidation;
                    }
                    break;
                }
                case "datetime": {
                    const datetimeTypeValidation = __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_validateDatetimeType).call(this, {
                        type,
                        key,
                        value,
                    });
                    if (!datetimeTypeValidation.valid) {
                        return datetimeTypeValidation;
                    }
                    break;
                }
                case "link": {
                    if (secondaryValue) {
                        const tagetValidation = __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_validateLinkTarget).call(this, secondaryValue);
                        if (!tagetValidation.valid) {
                            return tagetValidation;
                        }
                    }
                    break;
                }
                case "pagelink": {
                    if (secondaryValue) {
                        const tagetValidation = __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_validateLinkTarget).call(this, secondaryValue);
                        if (!tagetValidation.valid) {
                            return tagetValidation;
                        }
                    }
                    break;
                }
            }
            return {
                valid: true,
            };
        }
    },
    _BrickBuilder_instances = new WeakSet(),
    _BrickBuilder_validateSelectType = function _BrickBuilder_validateSelectType(field, { type, key, value, }) {
        // Check if value is in the options
        if (field.options) {
            const optionValues = field.options.map((option) => option.value);
            if (!optionValues.includes(value)) {
                return {
                    valid: false,
                    message: "Value must be one of the provided options.",
                };
            }
        }
        return {
            valid: true,
        };
    },
    _BrickBuilder_validateWysiwygType = function _BrickBuilder_validateWysiwygType(field, { type, key, value, }) {
        const sanitizedValue = (0, sanitize_html_1.default)(value, {
            allowedTags: [],
            allowedAttributes: {},
        });
        // run zod validation
        if (field.validation?.zod) {
            const zodValidation = __classPrivateFieldGet(this, _BrickBuilder_instances, "m", _BrickBuilder_validateZodSchema).call(this, field.validation.zod, sanitizedValue);
            if (!zodValidation.valid) {
                return zodValidation;
            }
        }
        return {
            valid: true,
        };
    },
    _BrickBuilder_validateImageType = function _BrickBuilder_validateImageType(field, { type, key, value, }) {
        // TODO: add validation for extensions and max/min size
        return {
            valid: true,
        };
    },
    _BrickBuilder_validateFileType = function _BrickBuilder_validateFileType(field, { type, key, value, }) {
        // TODO: add validation for extensions
        return {
            valid: true,
        };
    },
    _BrickBuilder_validateDatetimeType = function _BrickBuilder_validateDatetimeType({ type, key, value, }) {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            return {
                valid: false,
                message: "Value must be a valid date.",
            };
        }
        return {
            valid: true,
        };
    },
    _BrickBuilder_validateLinkTarget = function _BrickBuilder_validateLinkTarget(value) {
        const allowedValues = ["_self", "_blank"];
        if (!allowedValues.includes(value)) {
            return {
                valid: false,
                message: "Target must be _self or _blank.",
            };
        }
        return {
            valid: true,
        };
    },
    _BrickBuilder_validateRequired = function _BrickBuilder_validateRequired(value) {
        if (value === undefined || value === null || value === "") {
            return {
                valid: false,
                message: "This field is required.",
            };
        }
        return {
            valid: true,
        };
    },
    _BrickBuilder_validateType = function _BrickBuilder_validateType(providedType, type) {
        if (providedType !== type) {
            return {
                valid: false,
                message: `Field type must be "${type}".`,
            };
        }
        return {
            valid: true,
        };
    },
    _BrickBuilder_validateZodSchema = function _BrickBuilder_validateZodSchema(schema, value) {
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
    },
    _BrickBuilder_validateIsString = function _BrickBuilder_validateIsString(value) {
        if (typeof value !== "string") {
            return {
                valid: false,
                message: "Value must be a string.",
            };
        }
        return {
            valid: true,
        };
    },
    _BrickBuilder_validateIsNumber = function _BrickBuilder_validateIsNumber(value) {
        if (typeof value !== "number") {
            return {
                valid: false,
                message: "Value must be a number.",
            };
        }
        return {
            valid: true,
        };
    },
    _BrickBuilder_validateIsBoolean = function _BrickBuilder_validateIsBoolean(value) {
        if (typeof value !== "boolean") {
            return {
                valid: false,
                message: "Value must be a boolean.",
            };
        }
        return {
            valid: true,
        };
    },
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
exports.default = BrickBuilder;
