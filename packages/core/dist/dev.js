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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactForm = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = __importDefault(require("zod"));
const console_log_colors_1 = require("console-log-colors");
const index_1 = __importStar(require("./index"));
const app = (0, express_1.default)();
index_1.default.init(app);
exports.ContactForm = new index_1.FormBuilder("contact-form", {
    title: "Contact Form",
    fields: [
        {
            name: "name",
            label: "Name",
            type: "text",
            zod: zod_1.default.string().min(3),
            show_in_table: true,
        },
        {
            name: "email",
            label: "Email",
            type: "text",
            zod: zod_1.default.string().email(),
            show_in_table: true,
        },
        {
            name: "message",
            label: "Message",
            type: "textarea",
        },
    ],
});
app.get("/test", async (req, res, next) => {
    try {
        const data = {
            name: "John Doe",
            email: "wyallop14@gmail.com",
            message: "Hello world!",
        };
        const { valid, errors } = await exports.ContactForm.validate(data);
        if (!valid) {
            return res.json({ errors });
        }
        const submission = await (0, index_1.submitForm)({
            environment_key: "site_prod",
            form: exports.ContactForm,
            data,
        });
        res.json({ submission });
    }
    catch (error) {
        next(error);
    }
});
app.listen(8393, () => {
    console_log_colors_1.log.white("----------------------------------------------------");
    console_log_colors_1.log.yellow(`CMS started at: http://localhost:8393`);
    console_log_colors_1.log.yellow(`API started at: http://localhost:8393/api`);
    console_log_colors_1.log.white("----------------------------------------------------");
});
//# sourceMappingURL=dev.js.map