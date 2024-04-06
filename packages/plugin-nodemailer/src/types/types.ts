import type { Transporter } from "nodemailer";

export interface PluginOptions {
	from: {
		email: string;
		name: string;
	};
	transporter: Transporter;
}
