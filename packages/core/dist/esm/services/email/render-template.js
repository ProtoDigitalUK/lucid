import fs from "fs-extra";
import Handlebars from "handlebars";
import mjml2html from "mjml";
import path from "path";
import Config from "../Config.js";
const getTemplateData = async (template) => {
    const templatePath = path.join(__dirname, `../../../templates/${template}.mjml`);
    if (await fs.pathExists(templatePath)) {
        return fs.readFile(templatePath, "utf-8");
    }
    if (Config.email?.templateDir) {
        const templatePath = `${Config.email.templateDir}/${template}.mjml`;
        if (await fs.pathExists(templatePath)) {
            return fs.readFile(templatePath, "utf-8");
        }
    }
    throw new Error(`Template ${template} not found`);
};
const renderTemplate = async (template, data) => {
    const mjmlFile = await getTemplateData(template);
    const mjmlTemplate = Handlebars.compile(mjmlFile);
    const mjml = mjmlTemplate(data);
    const htmlOutput = mjml2html(mjml);
    return htmlOutput.html;
};
export default renderTemplate;
//# sourceMappingURL=render-template.js.map