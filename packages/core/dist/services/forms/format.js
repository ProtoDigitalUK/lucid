"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatForm = (instance) => {
    return {
        key: instance.key,
        title: instance.options.title,
        description: instance.options.description || null,
        fields: instance.options.fields,
    };
};
exports.default = formatForm;
//# sourceMappingURL=format.js.map