import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: "localhost",
	port: 1025,
	secure: false,
});

transporter
	.verify()
	.then(() => {
		console.log("Email transporter is ready");
	})
	.catch((error) => {
		console.error("Email transporter is not ready", error);
	});

export default transporter;
