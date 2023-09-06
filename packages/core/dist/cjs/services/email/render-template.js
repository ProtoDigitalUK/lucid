"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const handlebars_1 = __importDefault(require("handlebars"));
const mjml_1 = __importDefault(require("mjml"));
const path_1 = __importDefault(require("path"));
const Config_js_1 = __importDefault(require("../Config.js"));
const getTemplateData = async (template) => {
    const templatePath = path_1.default.join(__dirname, `../../../templates/${template}.mjml`);
    if (await fs_extra_1.default.pathExists(templatePath)) {
        return fs_extra_1.default.readFile(templatePath, "utf-8");
    }
    if (Config_js_1.default.email?.templateDir) {
        const templatePath = `${Config_js_1.default.email.templateDir}/${template}.mjml`;
        if (await fs_extra_1.default.pathExists(templatePath)) {
            return fs_extra_1.default.readFile(templatePath, "utf-8");
        }
    }
    throw new Error(`Template ${template} not found`);
};
const renderTemplate = async (template, data) => {
    const mjmlFile = await getTemplateData(template);
    const mjmlTemplate = handlebars_1.default.compile(mjmlFile);
    const mjml = mjmlTemplate(data);
    const htmlOutput = (0, mjml_1.default)(mjml);
    return htmlOutput.html;
};
exports.default = renderTemplate;
//# sourceMappingURL=render-template.js.map