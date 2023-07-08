"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BrickConfig_1 = __importDefault(require("../../db/models/BrickConfig"));
const Environment_1 = __importDefault(require("../../db/models/Environment"));
const create_url_1 = __importDefault(require("../media/create-url"));
const specificFieldValues = (type, builderField, field) => {
    let value = null;
    switch (type) {
        case "tab": {
            break;
        }
        case "text": {
            value = field?.text_value || builderField.default || "";
            break;
        }
        case "wysiwyg": {
            value = field?.text_value || builderField.default || "";
            break;
        }
        case "media": {
            value = {
                id: field?.media_id || undefined,
                url: (0, create_url_1.default)(field?.media.key || undefined),
                key: field?.media.key || undefined,
                mime_type: field?.media.mime_type || undefined,
                file_extension: field?.media.file_extension || undefined,
                file_size: field?.media.file_size || undefined,
                width: field?.media.width || undefined,
                height: field?.media.height || undefined,
                name: field?.media.name || undefined,
                alt: field?.media.alt || undefined,
            };
            break;
        }
        case "number": {
            value = field?.int_value || builderField.default || 0;
            break;
        }
        case "checkbox": {
            value = field?.bool_value || builderField.default || false;
            break;
        }
        case "select": {
            value = field?.text_value || builderField.default || "";
            break;
        }
        case "textarea": {
            value = field?.text_value || builderField.default || "";
            break;
        }
        case "json": {
            value = field?.json_value || builderField.default || {};
            break;
        }
        case "colour": {
            value = field?.text_value || builderField.default || "";
            break;
        }
        case "datetime": {
            value = field?.text_value || builderField.default || "";
            break;
        }
        case "pagelink": {
            value = {
                id: field?.page_link_id || undefined,
                target: field?.json_value.target || "_self",
                title: field?.linked_page.title || undefined,
                full_slug: field?.linked_page.full_slug || undefined,
                slug: field?.linked_page.slug || undefined,
            };
            break;
        }
        case "link": {
            value = {
                target: field?.json_value.target || "_self",
                url: field?.text_value || builderField.default || "",
            };
            break;
        }
    }
    return { value };
};
const buildFieldTree = (brickId, fields, builderInstance) => {
    const brickFields = fields.filter((field) => field.collection_brick_id === brickId);
    const basicFieldTree = builderInstance.basicFieldTree;
    const buildFields = (fields) => {
        const fieldObjs = [];
        fields.forEach((field) => {
            const brickField = brickFields.find((bField) => bField.key === field.key);
            const { value } = specificFieldValues(field.type, field, brickField);
            if (!brickField) {
                const fieldObj = {
                    fields_id: -1,
                    key: field.key,
                    type: field.type,
                };
                if (value !== null)
                    fieldObj.value = value;
                fieldObjs.push(fieldObj);
            }
            else {
                if (field.type === "repeater") {
                    fieldObjs.push({
                        fields_id: brickField.fields_id,
                        key: brickField.key,
                        type: brickField.type,
                        items: buildFields(field.fields || []),
                    });
                }
                else {
                    const fieldObj = {
                        fields_id: brickField.fields_id,
                        key: brickField.key,
                        type: brickField.type,
                    };
                    if (value !== null)
                        fieldObj.value = value;
                    fieldObjs.push(fieldObj);
                }
            }
        });
        return fieldObjs;
    };
    const fieldRes = buildFields(basicFieldTree);
    return fieldRes;
};
const buildBrickStructure = (brickFields) => {
    const brickStructure = [];
    brickFields.forEach((brickField) => {
        const brickStructureIndex = brickStructure.findIndex((brick) => brick.id === brickField.id);
        if (brickStructureIndex === -1) {
            brickStructure.push({
                id: brickField.id,
                key: brickField.brick_key,
                order: brickField.brick_order,
                type: brickField.brick_type,
                fields: [],
            });
        }
    });
    return brickStructure;
};
const formatBricks = async (data) => {
    const builderInstances = BrickConfig_1.default.getBrickConfig();
    if (!builderInstances)
        return [];
    const environment = await Environment_1.default.getSingle(data.environment_key);
    if (!environment)
        return [];
    const brickStructure = buildBrickStructure(data.brick_fields).filter((brick) => {
        const allowed = BrickConfig_1.default.isBrickAllowed({
            key: brick.key,
            type: brick.type,
            environment,
            collection: data.collection,
        });
        return allowed.allowed;
    });
    brickStructure.forEach((brick) => {
        const instance = builderInstances.find((b) => b.key === brick.key);
        if (!instance)
            return;
        brick.fields = buildFieldTree(brick.id, data.brick_fields, instance);
    });
    return brickStructure;
};
exports.default = formatBricks;
//# sourceMappingURL=format-bricks.js.map