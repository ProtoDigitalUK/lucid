"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatCollection = (instance) => {
    return {
        key: instance.key,
        title: instance.config.title,
        singular: instance.config.singular,
        description: instance.config.description || null,
        type: instance.config.type,
        bricks: instance.config.bricks,
    };
};
exports.default = formatCollection;
//# sourceMappingURL=format.js.map