"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const baseCustomFieldSchema = zod_1.default.object({
    type: zod_1.default.string(),
    key: zod_1.default.string(),
    title: zod_1.default.string(),
    description: zod_1.default.string().optional(),
    placeholder: zod_1.default.string().optional(),
    default: zod_1.default.union([zod_1.default.boolean(), zod_1.default.string()]).optional(),
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
class ValidationError extends Error {
    message;
    constructor(message) {
        super(message);
        this.message = message;
        this.name = "ValidationError";
    }
}
class BrickBuilder {
    key;
    title;
    fields = new Map();
    repeaterStack = [];
    maxRepeaterDepth = 5;
    config = {};
    constructor(key, config) {
        this.key = key;
        this.title = this.#keyToTitle(key);
        this.config = config || {};
    }
    addFields(BrickBuilder) {
        const fields = BrickBuilder.fields;
        fields.forEach((field) => {
            this.#checkKeyDuplication(field.key);
            this.fields.set(field.key, field);
        });
        return this;
    }
    endRepeater() {
        const key = this.repeaterStack.pop();
        if (!key) {
            throw new Error("No open repeater to end.");
        }
        const fields = Array.from(this.fields.values());
        let selectedRepeaterIndex = 0;
        let repeaterKey = "";
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
            repeater.fields = fieldsAfterSelectedRepeater.filter((field) => field.type !== "tab");
            fieldsAfterSelectedRepeater.map((field) => {
                this.fields.delete(field.key);
            });
        }
        return this;
    }
    addTab(config) {
        this.#checkKeyDuplication(config.key);
        this.#addToFields("tab", config);
        return this;
    }
    addText = (config) => {
        this.#checkKeyDuplication(config.key);
        this.#addToFields("text", config);
        return this;
    };
    addWysiwyg(config) {
        this.#checkKeyDuplication(config.key);
        this.#addToFields("wysiwyg", config);
        return this;
    }
    addMedia(config) {
        this.#checkKeyDuplication(config.key);
        this.#addToFields("media", config);
        return this;
    }
    addRepeater(config) {
        this.#checkKeyDuplication(config.key);
        if (this.repeaterStack.length >= this.maxRepeaterDepth) {
            throw new Error(`Maximum repeater depth of ${this.maxRepeaterDepth} exceeded.`);
        }
        this.#addToFields("repeater", config);
        this.repeaterStack.push(config.key);
        return this;
    }
    addNumber(config) {
        this.#checkKeyDuplication(config.key);
        this.#addToFields("number", config);
        return this;
    }
    addCheckbox(config) {
        this.#checkKeyDuplication(config.key);
        this.#addToFields("checkbox", config);
        return this;
    }
    addSelect(config) {
        this.#checkKeyDuplication(config.key);
        this.#addToFields("select", config);
        return this;
    }
    addTextarea(config) {
        this.#checkKeyDuplication(config.key);
        this.#addToFields("textarea", config);
        return this;
    }
    addJSON(config) {
        this.#checkKeyDuplication(config.key);
        this.#addToFields("json", config);
        return this;
    }
    addColour(config) {
        this.#checkKeyDuplication(config.key);
        this.#addToFields("colour", config);
        return this;
    }
    addDateTime(config) {
        this.#checkKeyDuplication(config.key);
        this.#addToFields("datetime", config);
        return this;
    }
    addPageLink(config) {
        this.#checkKeyDuplication(config.key);
        this.#addToFields("pagelink", config);
        return this;
    }
    addLink(config) {
        this.#checkKeyDuplication(config.key);
        this.#addToFields("link", config);
        return this;
    }
    get fieldTree() {
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
    get basicFieldTree() {
        const fieldArray = Array.from(this.fields.values());
        fieldArray.forEach((field) => {
            if (field.type === "tab") {
                fieldArray.splice(fieldArray.indexOf(field), 1);
            }
        });
        return fieldArray;
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
    fieldTypeToDataType = {
        text: "string",
        textarea: "string",
        colour: "string",
        datetime: "string",
        link: "string",
        wysiwyg: "string",
        select: "string",
        number: "number",
        pagelink: "number",
        checkbox: "boolean",
    };
    fieldValidation({ type, key, value, referenceData, flatFieldConfig, }) {
        try {
            const field = flatFieldConfig.find((item) => item.key === key);
            if (!field) {
                throw new ValidationError(`Field with key "${key}" does not exist.`);
            }
            if (field.type !== type) {
                throw new ValidationError(`Field with key "${key}" is not a ${type}.`);
            }
            if (field.validation?.required) {
                if (value === undefined || value === null || value === "") {
                    throw new ValidationError(`Please enter a value.`);
                }
            }
            if (field.validation?.zod && field.type !== "wysiwyg") {
                this.#validateZodSchema(field.validation.zod, value);
            }
            const dataType = this.fieldTypeToDataType[field.type];
            if (dataType) {
                if (typeof value !== dataType) {
                    throw new ValidationError(`The field value must be a ${dataType}.`);
                }
            }
            switch (field.type) {
                case "select": {
                    this.#validateSelectType(field, value);
                    break;
                }
                case "wysiwyg": {
                    this.#validateWysiwygType(field, value);
                    break;
                }
                case "media": {
                    this.#validateMediaType(field, referenceData);
                    break;
                }
                case "datetime": {
                    const date = new Date(value);
                    if (isNaN(date.getTime())) {
                        throw new ValidationError("Please ensure the date is valid.");
                    }
                    break;
                }
                case "link": {
                    this.#validateLinkTarget(referenceData);
                    break;
                }
                case "pagelink": {
                    if (!referenceData) {
                        throw new ValidationError("We couldn't find the page you selected.");
                    }
                    this.#validateLinkTarget(referenceData);
                    break;
                }
            }
        }
        catch (error) {
            if (error instanceof ValidationError) {
                return {
                    valid: false,
                    message: error.message,
                };
            }
            throw error;
        }
        return {
            valid: true,
        };
    }
    #validateSelectType(field, value) {
        if (field.options) {
            const optionValues = field.options.map((option) => option.value);
            if (!optionValues.includes(value)) {
                throw new ValidationError("Please ensure the value is a valid option.");
            }
        }
    }
    #validateWysiwygType(field, value) {
        const sanitizedValue = (0, sanitize_html_1.default)(value, {
            allowedTags: [],
            allowedAttributes: {},
        });
        if (field.validation?.zod) {
            this.#validateZodSchema(field.validation.zod, sanitizedValue);
        }
    }
    #validateMediaType(field, referenceData) {
        if (referenceData === undefined) {
            throw new ValidationError("We couldn't find the media you selected.");
        }
        if (field.validation?.extensions && field.validation.extensions.length) {
            const extension = referenceData.extension;
            if (!field.validation.extensions.includes(extension)) {
                throw new ValidationError(`Media must be one of the following extensions: ${field.validation.extensions.join(", ")}`);
            }
        }
        if (field.validation?.width) {
            const width = referenceData.width;
            if (!width) {
                throw new ValidationError("This media does not have a width.");
            }
            if (field.validation.width.min && width < field.validation.width.min) {
                throw new ValidationError(`Media width must be greater than ${field.validation.width.min}px.`);
            }
            if (field.validation.width.max && width > field.validation.width.max) {
                throw new ValidationError(`Media width must be less than ${field.validation.width.max}px.`);
            }
        }
        if (field.validation?.height) {
            const height = referenceData.height;
            if (!height) {
                throw new ValidationError("This media does not have a height.");
            }
            if (field.validation.height.min && height < field.validation.height.min) {
                throw new ValidationError(`Media height must be greater than ${field.validation.height.min}px.`);
            }
            if (field.validation.height.max && height > field.validation.height.max) {
                throw new ValidationError(`Media height must be less than ${field.validation.height.max}px.`);
            }
        }
    }
    #validateLinkTarget(referenceData) {
        const allowedValues = ["_self", "_blank"];
        if (!allowedValues.includes(referenceData.target)) {
            throw new ValidationError(`Please set the target to one of the following: ${allowedValues.join(", ")}.`);
        }
    }
    #validateZodSchema(schema, value) {
        try {
            schema.parse(value);
        }
        catch (error) {
            const err = error;
            throw new ValidationError(err.issues[0].message);
        }
    }
    #keyToTitle(key) {
        if (typeof key !== "string")
            return key;
        const title = key
            .split(/[-_]/g)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        return title;
    }
    #addToFields(type, config) {
        const noUndefinedConfig = Object.keys(config).reduce((acc, key) => {
            if (config[key] !== undefined) {
                acc[key] = config[key];
            }
            return acc;
        }, {});
        const data = {
            type: type,
            title: config.title || this.#keyToTitle(config.key),
            ...noUndefinedConfig,
        };
        const validation = baseCustomFieldSchema.safeParse(data);
        if (!validation.success) {
            throw new Error(validation.error.message);
        }
        this.fields.set(config.key, data);
    }
    #checkKeyDuplication(key) {
        if (this.fields.has(key)) {
            throw new Error(`Field with key "${key}" already exists.`);
        }
    }
}
exports.default = BrickBuilder;
__exportStar(require("./types.js"), exports);
//# sourceMappingURL=index.js.map