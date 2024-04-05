import type { Transporter } from "nodemailer";

declare global {
	interface PluginOptions {
		from: {
			email: string;
			name: string;
		};
		transporter: Transporter;
	}
}
