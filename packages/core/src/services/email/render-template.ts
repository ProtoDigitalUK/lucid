import fs from "fs-extra";
import Handlebars from "handlebars";
import mjml2html from "mjml";
import path from "path";
// Utils
import getDirName from "@utils/app/get-dirname.js";
// Models
import Config from "@services/Config.js";

const currentDir = getDirName(import.meta.url);

export interface renderTemplateDataT {
  [key: string]: any;
}

const getTemplateData = async (template: string) => {
  // if file exists, return the file
  const templatePath = path.join(currentDir, `../templates/${template}.mjml`);
  if (await fs.pathExists(templatePath)) {
    return fs.readFile(templatePath, "utf-8");
  }

  // if Config.email.templateDir exists, return the file
  if (Config.email?.templateDir) {
    const templatePath = `${Config.email.templateDir}/${template}.mjml`;
    if (await fs.pathExists(templatePath)) {
      return fs.readFile(templatePath, "utf-8");
    }
  }

  throw new Error(`Template ${template} not found`);
};

const renderTemplate = async (template: string, data: renderTemplateDataT) => {
  const mjmlFile = await getTemplateData(template);
  const mjmlTemplate = Handlebars.compile(mjmlFile);
  const mjml = mjmlTemplate(data);
  const htmlOutput = mjml2html(mjml);

  return htmlOutput.html;
};

export default renderTemplate;
