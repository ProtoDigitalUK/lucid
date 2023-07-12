"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatEnvironment = (environment) => {
    return {
        key: environment.key,
        title: environment.title || "",
        assigned_bricks: environment.assigned_bricks || [],
        assigned_collections: environment.assigned_collections || [],
        assigned_forms: environment.assigned_forms || [],
    };
};
exports.default = formatEnvironment;
//# sourceMappingURL=format-environment.js.map