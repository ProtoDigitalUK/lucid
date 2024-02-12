import nodemailer from "nodemailer";
import aws from "@aws-sdk/client-ses";

const transporter = nodemailer.createTransport({
	SES: {
		ses: new aws.SES({
			apiVersion: "2010-12-01",
			region: "eu-west-2",
		}),
		aws: aws,
	},
});

export default transporter;
