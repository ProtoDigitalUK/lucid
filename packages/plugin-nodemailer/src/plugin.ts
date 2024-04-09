import T from "./translations/index.js";
import verifyTransporter from "./utils/verify-transporter.js";
import type { HeadlessPluginOptions } from "@protoheadless/headless";
import type { PluginOptions } from "./types/types.js";

const plugin: HeadlessPluginOptions<PluginOptions> = (
	config,
	pluginOptions,
) => {
	verifyTransporter(pluginOptions.transporter);

	config.email = {
		from: pluginOptions.from,
		strategy: async (email, meta) => {
			try {
				await pluginOptions.transporter.sendMail({
					from: `${email.from.name} <${email.from.email}>`,
					to: email.to,
					subject: email.subject,
					cc: email.cc,
					bcc: email.bcc,
					replyTo: email.replyTo,
					text: email.text,
					html: email.html,
				});

				return {
					success: true,
					message: T("email_successfully_sent"),
				};
			} catch (error) {
				const err = error as Error;
				return {
					success: false,
					message: err.message,
				};
			}
		},
	};

	return config;
};

export default plugin;
