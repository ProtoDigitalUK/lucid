import fs from "fs-extra";
import Handlebars from "handlebars";
import mjml2html from "mjml";
import path from "node:path";
import { getDirName } from "../../utils/helpers.js";
import type { Config } from "../../types/config.js";
import type { ServiceFn, ServiceResponse } from "../../libs/services/types.js";

const currentDir = getDirName(import.meta.url);

const getTemplateData = async (
	config: Config,
	template: string,
): ServiceResponse<string> => {
	try {
		// if user given template exists, return the file
		const projectTemplatePath = config.paths?.emailTemplates
			? `${config.paths?.emailTemplates}/${template}.mjml`
			: path.resolve("./templates", `${template}.mjml`);
		if (await fs.pathExists(projectTemplatePath)) {
			return {
				error: undefined,
				data: await fs.readFile(projectTemplatePath, "utf-8"),
			};
		}

		// fallback to default template
		const packageTemplatePath = path.join(
			currentDir,
			`../templates/${template}.mjml`,
		);
		if (await fs.pathExists(packageTemplatePath)) {
			return {
				error: undefined,
				data: await fs.readFile(packageTemplatePath, "utf-8"),
			};
		}

		// TODO: move copy to translations file
		return {
			error: {
				type: "basic",
				name: "error",
				message: `Template ${template} not found`,
				status: 500,
			},
			data: undefined,
		};
	} catch (error) {
		// TODO: move copy to translations file
		return {
			error: {
				type: "basic",
				name: "error",
				message: `Template ${template} not found`,
				status: 500,
			},
			data: undefined,
		};
	}
};

const renderTemplate: ServiceFn<
	[
		{
			template: string;
			data: Record<string, unknown> | null;
		},
	],
	string
> = async (service, data) => {
	const mjmlFile = await getTemplateData(service.config, data.template);
	if (mjmlFile.error) return mjmlFile;

	const mjmlTemplate = Handlebars.compile(mjmlFile.data);
	const mjml = mjmlTemplate(data);
	const htmlOutput = mjml2html(mjml);

	return {
		error: undefined,
		data: htmlOutput.html,
	};
};

export default renderTemplate;
