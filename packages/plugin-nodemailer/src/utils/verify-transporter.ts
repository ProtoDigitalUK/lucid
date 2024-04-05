import type { Transporter } from "nodemailer";

const verifyTransporter = (transporter: Transporter) => {
	transporter
		.verify()
		.then(() => {
			console.log("Email transporter is ready");
		})
		.catch((error) => {
			console.error("Email transporter is not ready", error);
		});
};

export default verifyTransporter;
