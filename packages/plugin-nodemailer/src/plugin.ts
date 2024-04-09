import type { HeadlessPluginOptions } from "@protoheadless/headless";
import type { PluginOptions } from "./types/types.js";
import verifyTransporter from "./utils/verify-transporter.js";

/*
    TODO:
    - Update error message handling
*/

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
					message: "Email sent successfully",
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
