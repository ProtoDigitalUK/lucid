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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const index_1 = __importStar(require("./index"));
const bannerBrick = new index_1.BrickBuilder("banner")
    .addTab({
    key: "content_tab",
})
    .addText({
    key: "title",
    description: "The title of the banner",
    validate: (value) => {
        const v = value;
        if (v.length > 10) {
            return "Title must be less than 10 characters";
        }
        return "";
    },
})
    .addWysiwyg({
    key: "intro",
})
    .addRepeater({
    key: "social_links",
})
    .addText({
    key: "social_title",
})
    .addText({
    key: "social_url",
})
    .endRepeater()
    .addTab({
    key: "config_tab",
})
    .addCheckbox({
    key: "fullwidth",
    description: "Make the banner fullwidth",
});
const introBrick = new index_1.BrickBuilder("intro")
    .addTab({
    key: "content_tab",
})
    .addText({
    key: "title",
})
    .addWysiwyg({
    key: "intro",
});
exports.config = {
    port: 8393,
    origin: "*",
    environment: "development",
    secret_key: "f3b2e4b00b1a4b1e9b0a8b0a9b1e0b1a",
    bricks: [bannerBrick, introBrick],
};
(0, index_1.default)(exports.config);
//# sourceMappingURL=dev.js.map