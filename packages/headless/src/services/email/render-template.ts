import fs from "fs-extra";
import Handlebars from "handlebars";
import mjml2html from "mjml";
import path from "node:path";
import { getDirName } from "../../utils/helpers.js";
import getConfig from "../../libs/config/get-config.js";

const currentDir = getDirName(import.meta.url);

export interface RenderTemplateDataT {
	[key: string]: unknown;
}

const getTemplateData = async (template: string) => {
	const config = await getConfig();

	// if user given template exists, return the file
	const projectTemplatePath = config.paths?.emailTemplates
		? `${config.paths?.emailTemplates}/${template}.mjml`
		: path.resolve("./templates", `${template}.mjml`);
	if (await fs.pathExists(projectTemplatePath)) {
		return fs.readFile(projectTemplatePath, "utf-8");
	}

	// fallback to default template
	const packageTemplatePath = path.join(
		currentDir,
		`../templates/${template}.mjml`,
	);
	if (await fs.pathExists(packageTemplatePath)) {
		return fs.readFile(packageTemplatePath, "utf-8");
	}

	throw new Error(`Template ${template} not found`);
};

const renderTemplate = async (template: string, data: RenderTemplateDataT) => {
	const mjmlFile = await getTemplateData(template);
	const mjmlTemplate = Handlebars.compile(mjmlFile);
	const mjml = mjmlTemplate(data);
	const htmlOutput = mjml2html(mjml);

	return htmlOutput.html;
};

export default renderTemplate;
